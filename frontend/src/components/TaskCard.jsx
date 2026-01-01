import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, Tag, Avatar, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const TaskCard = ({ task, onMove, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card 
        size="small" 
        style={{ 
          marginBottom: 8, 
          cursor: 'move',
          border: isDragging ? '2px dashed #1890ff' : '1px solid #d9d9d9'
        }}
        actions={[
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(task)}
          />,
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(task.id)}
          />
        ]}
      >
        <Card.Meta 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{task.title}</span>
              <Tag color={getPriorityColor(task.priority)}>
                {task.priority}
              </Tag>
            </div>
          }
          description={
            <div>
              <p style={{ margin: '8px 0' }}>{task.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
                  {task.assignee?.name?.[0] || 'U'}
                </Avatar>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {task.assignee?.name || '未分配'}
                </span>
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default TaskCard;