import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Row, Col, Avatar, Badge, message, Button, Space, Tooltip } from 'antd';
import { ReloadOutlined, UserOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import { fetchTasks, createTaskAsync, updateTaskAsync, deleteTaskAsync, updateOnlineUsers, realTimeTaskUpdate } from '../store/taskSlice';
import TaskColumn from '../components/TaskColumn';
import TaskForm from '../components/TaskForm';

const socket = io('http://localhost:8899');

const CollaborativeBoard = () => {
  const dispatch = useDispatch();
  const { tasks, onlineUsers, loading } = useSelector(state => state.tasks);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // 加入项目
    socket.emit('joinProject', {
      id: 'user1',
      name: 'Current User',
      avatar: ''
    });

    dispatch(fetchTasks('project1'));

    // 监听实时更新
    socket.on('taskUpdated', (updatedTask) => {
      dispatch(realTimeTaskUpdate(updatedTask));
      message.info(`任务"${updatedTask.title}"已被更新`);
    });

    socket.on('usersOnline', (users) => {
      dispatch(updateOnlineUsers(users));
    });

    return () => {
      socket.off('taskUpdated');
      socket.off('usersOnline');
    };
  }, [dispatch]);

  // 处理任务拖拽移动
  const handleTaskMove = async (taskId, newStatus) => {
    console.log('拖拽任务:', taskId, '到状态:', newStatus);
    
    try {
      const result = await dispatch(updateTaskAsync({
        id: taskId,
        updates: { status: newStatus }
      }));
      
      console.log('Redux action 结果:', result);
      
      // 检查是否成功
      if (result.type === 'tasks/updateTask/fulfilled') {
        console.log('API调用成功:', result.payload);
        message.success('任务状态已更新');
        
        // 通知其他用户
        socket.emit('taskUpdate', {
          id: taskId,
          status: newStatus,
          action: 'move',
          title: result.payload.title
        });
      } else {
        console.error('拖拽更新失败:', result.error || result.payload);
        message.error('更新失败，请重试');
      }
    } catch (error) {
      console.error('拖拽异常:', error);
      message.error('更新失败，请重试');
    }
  };

  // 处理任务编辑
  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // 处理任务删除
  const handleTaskDelete = async (taskId) => {
    try {
      await dispatch(deleteTaskAsync(taskId)).unwrap();
      
      // 通知其他用户
      socket.emit('taskUpdate', {
        id: taskId,
        action: 'delete',
        title: tasks.find(t => t.id === taskId)?.title
      });
      
      message.success('任务已删除');
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  // 处理添加新任务
  const handleTaskAdd = (status) => {
    setEditingTask(null);
    setNewTaskStatus(status);
    setShowTaskForm(true);
  };

  // 处理任务保存
  const handleTaskSave = async (values) => {
    setFormLoading(true);
    try {
      const taskData = {
        ...values,
        assignee: values.assigneeName ? {
          id: Date.now().toString(),
          name: values.assigneeName
        } : null,
        status: editingTask ? editingTask.status : newTaskStatus,
        projectId: 'project1'
      };

      if (editingTask) {
        // 更新任务
        await dispatch(updateTaskAsync({
          id: editingTask.id,
          updates: taskData
        })).unwrap();
        
        // 通知其他用户
        socket.emit('taskUpdate', {
          id: editingTask.id,
          action: 'update',
          title: taskData.title
        });
        
        message.success('任务已更新');
      } else {
        // 创建新任务
        const newTask = await dispatch(createTaskAsync(taskData)).unwrap();
        
        // 通知其他用户
        socket.emit('taskUpdate', {
          id: newTask.id,
          action: 'create',
          title: taskData.title
        });
        
        message.success('任务已创建');
      }

      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setFormLoading(false);
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    dispatch(fetchTasks('project1'));
  };

  const columns = [
    { key: 'todo', title: '待办' },
    { key: 'inProgress', title: '进行中' },
    { key: 'done', title: '已完成' }
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: '20px' }}>
        {/* 顶部工具栏 */}
        <div style={{ 
          marginBottom: '20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div>
            <h2 style={{ margin: 0, marginBottom: '8px' }}>协作任务看板</h2>
            <Space>
              <Badge count={onlineUsers.length} showZero>
                <UserOutlined style={{ fontSize: '16px' }} />
              </Badge>
              <span>在线用户:</span>
              <Avatar.Group maxCount={5}>
                {onlineUsers.map(user => (
                  <Tooltip key={user.id} title={user.name}>
                    <Avatar style={{ backgroundColor: '#1890ff' }}>
                      {user.name[0]}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </Space>
          </div>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading}
          >
            刷新
          </Button>
        </div>

        {/* 任务看板 */}
        <Row gutter={16}>
          {columns.map(column => {
            const columnTasks = tasks.filter(task => task.status === column.key);
            return (
              <Col span={8} key={column.key}>
                <TaskColumn
                  title={column.title}
                  status={column.key}
                  tasks={columnTasks}
                  onTaskMove={handleTaskMove}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={handleTaskDelete}
                  onTaskAdd={handleTaskAdd}
                  loading={loading}
                />
              </Col>
            );
          })}
        </Row>

        {/* 任务编辑表单 */}
        <TaskForm
          visible={showTaskForm}
          task={editingTask}
          onSave={handleTaskSave}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          loading={formLoading}
        />
      </div>
    </DndProvider>
  );
};

export default CollaborativeBoard;