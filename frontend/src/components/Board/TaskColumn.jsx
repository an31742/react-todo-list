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
  onReorder,
  loading
}) => {
  // 只处理跨列拖拽（同列排序由 TaskCard 处理）
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    canDrop: (item) => item.status !== status,
    drop: (item) => {
      if (item.status !== status) {
        onTaskMove(item.id, status)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
      canDrop: monitor.canDrop(),
    }),
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#f0f0f0'
      case 'inProgress': return '#e6f7ff'
      case 'done': return '#f6ffed'
      default: return '#f0f0f0'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'todo': return '待办'
      case 'inProgress': return '进行中'
      case 'done': return '已完成'
      default: return status
    }
  }

  return (
    <div
      ref={drop}
      style={{
        minHeight: '500px',
        backgroundColor: isOver ? '#bae7ff' : 'transparent',
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
                key={task._id}
                task={task}
                columnTasks={tasks}
                columnStatus={status}
                onMove={onTaskMove}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                onReorder={onReorder}
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
  )
}

export default TaskColumn
