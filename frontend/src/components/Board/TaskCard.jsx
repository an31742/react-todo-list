import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, Tag, Avatar, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const TaskCard = ({ task, onMove, onEdit, onDelete, onReorder, columnTasks, columnStatus }) => {
  const ref = useRef(null);
  const [hoverDir, setHoverDir] = useState(null);

  // --- Drop target：同列排序 ---
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'task',
    canDrop: (item) => item.status === columnStatus && item.id !== task._id,
    hover: (item, monitor) => {
      if (!ref.current) return
      if (item.id === task._id) { setHoverDir(null); return }

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      setHoverDir(hoverClientY < hoverMiddleY ? 'top' : 'bottom')
    },
    drop: (item) => {
      if (item.id === task._id) return

      const sorted = [...columnTasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      const draggedIdx = sorted.findIndex(t => t._id === item.id)
      const hoverIdx = sorted.findIndex(t => t._id === task._id)

      const filteredIdx = hoverIdx - (draggedIdx < hoverIdx ? 1 : 0)
      const targetIndex = hoverDir === 'top' ? filteredIdx : filteredIdx + 1

      onReorder(item.id, Math.max(0, Math.min(targetIndex, sorted.length - 1)), columnStatus)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  // --- Drag source ---
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task._id, status: columnStatus },
    end: () => setHoverDir(null),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // 合并 ref
  drag(drop(ref))

  const showLine = isOver && canDrop

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red'
      case 'medium': return 'orange'
      case 'low': return 'green'
      default: return 'blue'
    }
  }

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.4 : 1, position: 'relative' }}>
      {/* 插入指示线 */}
      {showLine && hoverDir === 'top' && (
        <div style={{
          position: 'absolute', top: -4, left: 0, right: 0, height: 4,
          backgroundColor: '#1890ff', borderRadius: 2, zIndex: 10,
        }} />
      )}
      <Card
        size="small"
        style={{
          marginBottom: 8,
          cursor: 'move',
          border: showLine
            ? '2px solid #1890ff'
            : isDragging
              ? '2px dashed #1890ff'
              : '1px solid #d9d9d9',
        }}
        actions={[
          <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => onEdit(task)} />,
          <Button key="delete" type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(task._id)} />,
        ]}
      >
        <Card.Meta
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{task.title}</span>
              <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
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
      {showLine && hoverDir === 'bottom' && (
        <div style={{
          position: 'absolute', bottom: 8, left: 0, right: 0, height: 4,
          backgroundColor: '#1890ff', borderRadius: 2, zIndex: 10,
        }} />
      )}
    </div>
  )
}

export default TaskCard
