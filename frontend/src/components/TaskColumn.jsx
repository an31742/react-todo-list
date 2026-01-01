import React from 'react';
import { useDrop } from 'react-dnd';
import { Card, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TaskCard from './TaskCard';

const TaskColumn = ({ 
  title, 
  status, 
  tasks, 
  onTaskMove, 
  onTaskEdit, 
  onTaskDelete, 
  onTaskAdd,
  loading 
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      console.log('拖拽事件:', item, '到状态:', status);
      if (item.status !== status) {
        console.log('调用 onTaskMove:', item.id, status);
        onTaskMove(item.id, status);
      } else {
        console.log('状态相同，不需要更新');
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#f0f0f0';
      case 'inProgress': return '#e6f7ff';
      case 'done': return '#f6ffed';
      default: return '#f0f0f0';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'todo': return '待办';
      case 'inProgress': return '进行中';
      case 'done': return '已完成';
      default: return status;
    }
  };

  return (
    <div 
      ref={drop}
      style={{
        minHeight: '500px',
        backgroundColor: isOver ? '#e6f7ff' : 'transparent',
        padding: '8px',
        borderRadius: '4px',
        border: isOver ? '2px dashed #1890ff' : '2px dashed transparent',
      }}
    >
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{getStatusText(status)} ({tasks.length})</span>
            <Button 
              type="text" 
              icon={<PlusOutlined />} 
              onClick={() => onTaskAdd(status)}
              size="small"
            >
              添加任务
            </Button>
          </div>
        }
        style={{ 
          backgroundColor: getStatusColor(status),
          minHeight: '450px'
        }}
        bodyStyle={{ padding: '12px' }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>加载中...</div>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onMove={onTaskMove}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            ))}
            {tasks.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                color: '#999', 
                padding: '40px 0',
                border: '2px dashed #d9d9d9',
                borderRadius: '4px'
              }}>
                拖拽任务到这里或点击添加按钮
              </div>
            )}
          </Space>
        )}
      </Card>
    </div>
  );
};

export default TaskColumn;