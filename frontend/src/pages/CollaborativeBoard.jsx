import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Row, Col, message, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { fetchTasks, createTaskAsync, updateTaskAsync, deleteTaskAsync, reorderTaskAsync } from '../store/taskSlice';
import TaskColumn from '../components/Board/TaskColumn';
import TaskForm from '../components/Board/TaskForm';

const CollaborativeBoard = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector(state => state.tasks);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');
  const [formLoading, setFormLoading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks('project1'));
  }, [dispatch]);

  // 处理任务拖拽移动（跨列）
  const handleTaskMove = async (taskId, newStatus) => {
    if (isReordering) return
    setIsReordering(true)
    try {
      const result = await dispatch(updateTaskAsync({
        id: taskId,
        updates: { status: newStatus }
      }))

      if (result.type === 'tasks/updateTask/fulfilled') {
        message.success('任务状态已更新')
      } else {
        message.error('更新失败，请重试')
      }
    } catch (error) {
      message.error('更新失败，请重试')
    } finally {
      setIsReordering(false)
    }
  }

  // 处理拖拽重排序（同列），加锁防止快速连续拖拽
  const handleReorder = async (taskId, targetIndex, targetStatus) => {
    if (isReordering) return
    setIsReordering(true)
    try {
      const result = await dispatch(reorderTaskAsync({
        taskId, targetIndex, targetStatus
      }))

      if (result.type === 'tasks/reorderTask/fulfilled') {
        await dispatch(fetchTasks('project1'))
      } else {
        message.error('排序失败，请重试')
      }
    } catch (error) {
      message.error('排序失败，请重试')
    } finally {
      setIsReordering(false)
    }
  }

  // 处理任务编辑
  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // 处理任务删除
  const handleTaskDelete = async (taskId) => {
    try {
      await dispatch(deleteTaskAsync(taskId)).unwrap();
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
        await dispatch(updateTaskAsync({
          id: editingTask._id,
          updates: taskData
        })).unwrap();
        message.success('任务已更新');
      } else {
        await dispatch(createTaskAsync(taskData)).unwrap();
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
          <h2 style={{ margin: 0 }}>协作任务看板</h2>
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
                  onReorder={handleReorder}
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
