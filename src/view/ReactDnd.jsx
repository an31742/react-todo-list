import React, { useState, useMemo } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import "../components/reactDnd/reactDnd.css"

// 模拟组件库数据
const componentLibrary = [
  { id: "button", type: "Button", name: "按钮", icon: "🔘", defaultProps: { text: "按钮", size: "medium" } },
  { id: "input", type: "Input", name: "输入框", icon: "📝", defaultProps: { placeholder: "请输入...", size: "medium" } },
  { id: "card", type: "Card", name: "卡片", icon: "🃏", defaultProps: { title: "卡片标题", content: "卡片内容" } },
  { id: "image", type: "Image", name: "图片", icon: "🖼️", defaultProps: { src: "https://via.placeholder.com/150", alt: "图片" } },
  { id: "header", type: "Header", name: "页眉", icon: "📋", defaultProps: { title: "页面标题", subtitle: "副标题" } },
  { id: "footer", type: "Footer", name: "页脚", icon: "📌", defaultProps: { content: "© 2023 版权所有" } },
  { id: "section", type: "Section", name: "区域", icon: "📦", defaultProps: { title: "内容区域", bgColor: "#f8f9fa" } },
  { id: "divider", type: "Divider", name: "分割线", icon: "➖", defaultProps: { height: "2px", color: "#e0e0e0" } },
]

// 模拟组件实现
const Button = ({ text, size, onEdit }) => {
  return (
    <div className="component" onClick={onEdit}>
      <button className={`btn ${size}`}>{text}</button>
    </div>
  )
}

const Input = ({ placeholder, size, onEdit }) => {
  return (
    <div className="component" onClick={onEdit}>
      <input type="text" className={`input ${size}`} placeholder={placeholder} />
    </div>
  )
}

const Card = ({ title, content, onEdit }) => {
  return (
    <div className="component card" onClick={onEdit}>
      <div className="card-header">{title}</div>
      <div className="card-content">{content}</div>
    </div>
  )
}

const Image = ({ src, alt, onEdit }) => {
  return (
    <div className="component" onClick={onEdit}>
      <img src={src} alt={alt} style={{ maxWidth: "100%" }} />
    </div>
  )
}

const Header = ({ title, subtitle, onEdit }) => {
  return (
    <div className="component header" onClick={onEdit}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
}

const Footer = ({ content, onEdit }) => {
  return (
    <div className="component footer" onClick={onEdit}>
      <p>{content}</p>
    </div>
  )
}

const Section = ({ title, bgColor, children, onEdit }) => {
  return (
    <div className="component section" onClick={onEdit} style={{ backgroundColor: bgColor }}>
      <h3>{title}</h3>
      <div className="section-content">{children}</div>
    </div>
  )
}

const Divider = ({ height, color, onEdit }) => {
  return (
    <div
      className="component divider"
      onClick={onEdit}
      style={{
        height,
        backgroundColor: color,
        margin: "15px 0",
      }}
    />
  )
}

// 拖拽组件项  展示左侧拖拽项
const DraggableComponent = ({ item }) => {
  // 这段代码使用了react-dnd的useDrag钩子，使组件库中的每个组件项都可以被拖拽。
  // useDrag返回一个drag方法和一个isDragging状态。
  // type: "component" 表示拖拽的数据类型。
  // item: { ...item } 指定拖拽时携带的数据（即当前组件项的所有属性）。
  // collect函数用于收集拖拽状态，这里只关心isDragging（当前项是否正在被拖拽）。
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { ...item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} className={`library-item ${isDragging ? "dragging" : ""}`}>
      <span className="item-icon">{item.icon}</span>
      <span className="item-name">{item.name}</span>
    </div>
  )
}

// 画布区域
const Canvas = ({ components, onDrop, onEdit, onDelete, onMove }) => {
  // 这段代码使用了 react-dnd 的 useDrop 钩子，使 Canvas 画布区域可以作为拖拽目标接收组件。
  // useDrop 返回一个 drop 方法（用于绑定到 DOM 节点上）和 isOver 状态（表示当前是否有拖拽项悬停在画布上）。
  // accept: "component" 表示只接受类型为 "component" 的拖拽项。
  // drop: 当有组件被放下时，调用 onDrop 并传入拖拽的 item。
  // collect: 用于收集拖拽状态，这里只关心 isOver（是否有拖拽项悬停）。
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div ref={drop} className={`canvas ${isOver ? "drop-active" : ""}`}>
      {components.length === 0 ? (
        <div className="empty-canvas">
          <p>从左侧拖拽组件到此处</p>
          <p>可同时展示多个组件</p>
        </div>
      ) : (
        components.map((comp, index) => <CanvasComponent key={comp.id} comp={comp} index={index} onEdit={() => onEdit(comp.id)} onDelete={() => onDelete(comp.id)} onMove={onMove} />)
      )}
    </div>
  )
}

// 画布中的组件
const CanvasComponent = ({ comp, index, onEdit, onDelete, onMove }) => {
  // 这段代码实现了画布中单个组件的拖拽和排序功能。
  // useDrag 用于让当前组件变成可拖拽项，type 设置为 "canvas-component"，item 携带当前组件的 id 和索引。
  // collect 返回 isDragging，表示当前组件是否正在被拖拽。
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "canvas-component",
    item: { id: comp.id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  // useDrop 让当前组件可以作为拖拽目标，accept 只接受 "canvas-component" 类型的拖拽项。
  // hover 回调在有其他组件悬停在当前组件上时触发，如果索引不同则调用 onMove 交换顺序，并更新拖拽项的 index。
  // collect 返回 isOver，表示是否有拖拽项悬停在当前组件上。
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "canvas-component",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index)
        draggedItem.index = index
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  // 动画样式
  const style = useMemo(
    () => ({
      transition: isDragging ? "transform 0.2s cubic-bezier(0.4,0,0.2,1)" : undefined,
      transform: isDragging ? "scale(1.05) rotate(-2deg)" : "none",
      zIndex: isDragging ? 1000 : 1,
      opacity: isDragging ? 0.7 : 1,
    }),
    [isDragging]
  )

  const renderComponent = () => {
    const props = { ...comp.props, onEdit }
    switch (comp.type) {
      case "Button":
        return <Button {...props} />
      case "Input":
        return <Input {...props} />
      case "Card":
        return <Card {...props} />
      case "Image":
        return <Image {...props} />
      case "Header":
        return <Header {...props} />
      case "Footer":
        return <Footer {...props} />
      case "Section":
        return <Section {...props} />
      case "Divider":
        return <Divider {...props} />
      default:
        return null
    }
  }
  //展示组件
  return (
    <div ref={(node) => drag(drop(node))} className={`canvas-component ${isDragging ? "dragging" : ""} ${isOver ? "drop-hover" : ""}`} style={style}>
      {renderComponent()}
      <div className="component-actions">
        <button onClick={onDelete} className="delete-btn">
          ×
        </button>
      </div>
    </div>
  )
}

// 属性面板 展示属性
const PropertyPanel = ({ selectedComponent, onUpdate }) => {
  if (!selectedComponent) {
    return (
      <div className="property-panel">
        <h3>属性设置</h3>
        <p>请选择画布中的组件进行配置</p>
        <div className="property-tips">
          <p>💡 提示：可以同时展示多个组件</p>
          <p>💡 拖拽组件可调整顺序</p>
          <p>💡 使用容器组件组织内容</p>
        </div>
      </div>
    )
  }

  const handleChange = (prop, value) => {
    onUpdate(selectedComponent.id, { ...selectedComponent.props, [prop]: value })
  }
  //展示属性
  const renderPropertyControls = () => {
    const { type, props } = selectedComponent

    switch (type) {
      case "Button":
        return (
          <>
            <div className="property-group">
              <label>按钮文本</label>
              <input type="text" value={props.text} onChange={(e) => handleChange("text", e.target.value)} />
            </div>
            <div className="property-group">
              <label>尺寸</label>
              <select value={props.size} onChange={(e) => handleChange("size", e.target.value)}>
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
              </select>
            </div>
          </>
        )

      case "Input":
        return (
          <>
            <div className="property-group">
              <label>占位文本</label>
              <input type="text" value={props.placeholder} onChange={(e) => handleChange("placeholder", e.target.value)} />
            </div>
            <div className="property-group">
              <label>尺寸</label>
              <select value={props.size} onChange={(e) => handleChange("size", e.target.value)}>
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
              </select>
            </div>
          </>
        )

      case "Card":
        return (
          <>
            <div className="property-group">
              <label>标题</label>
              <input type="text" value={props.title} onChange={(e) => handleChange("title", e.target.value)} />
            </div>
            <div className="property-group">
              <label>内容</label>
              <textarea value={props.content} onChange={(e) => handleChange("content", e.target.value)} />
            </div>
          </>
        )

      case "Image":
        return (
          <div className="property-group">
            <label>图片URL</label>
            <input type="text" value={props.src} onChange={(e) => handleChange("src", e.target.value)} />
          </div>
        )

      case "Section":
        return (
          <>
            <div className="property-group">
              <label>标题</label>
              <input type="text" value={props.title} onChange={(e) => handleChange("title", e.target.value)} />
            </div>
            <div className="property-group">
              <label>背景颜色</label>
              <input type="color" value={props.bgColor} onChange={(e) => handleChange("bgColor", e.target.value)} />
            </div>
          </>
        )

      case "Divider":
        return (
          <>
            <div className="property-group">
              <label>高度</label>
              <input type="text" value={props.height} onChange={(e) => handleChange("height", e.target.value)} placeholder="例如: 2px" />
            </div>
            <div className="property-group">
              <label>颜色</label>
              <input type="color" value={props.color} onChange={(e) => handleChange("color", e.target.value)} />
            </div>
          </>
        )

      default:
        return <p>该组件暂无可用配置项</p>
    }
  }

  return (
    <div className="property-panel">
      <h3>{selectedComponent.name} 属性</h3>
      <div className="property-controls">{renderPropertyControls()}</div>
    </div>
  )
}
//展示属性
const ReactDnd = () => {
  const [components, setComponents] = useState([])
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)

  const handleDrop = (item) => {
    const newId = `${item.type}-${Date.now()}`
    const newComponent = {
      id: newId,
      type: item.type,
      name: item.name,
      props: { ...item.defaultProps },
    }
    setComponents((prev) => [...prev, newComponent])
  }

  const handleEdit = (id) => {
    const comp = components.find((c) => c.id === id)
    setSelectedComponent(comp)
  }

  const handleUpdate = (id, newProps) => {
    setComponents(components.map((comp) => (comp.id === id ? { ...comp, props: newProps } : comp)))
    setSelectedComponent({ ...selectedComponent, props: newProps })
  }

  const handleDelete = (id) => {
    const newComponents = components.filter((comp) => comp.id !== id)
    setComponents(newComponents)
    if (selectedComponent && selectedComponent.id === id) {
      setSelectedComponent(null)
    }
  }

  const handleMove = (fromIndex, toIndex) => {
    const newComponents = [...components]
    const [movedItem] = newComponents.splice(fromIndex, 1)
    newComponents.splice(toIndex, 0, movedItem)
    setComponents(newComponents)
  }

  const togglePreview = () => {
    setPreviewMode(!previewMode)
    setSelectedComponent(null)
  }

  return (
    //展示可拖拽及画布
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <header>
          <h1>React DnD 多组件低代码平台</h1>
          <div className="actions">
            <button onClick={() => setComponents([])}>清空画布</button>
            <button onClick={togglePreview}>{previewMode ? "编辑模式" : "预览模式"}</button>
            <div className="status">
              <span>已添加组件: {components.length}</span>
            </div>
          </div>
        </header>

        <div className="main-container">
          <div className="component-library">
            <h2>组件库</h2>
            <div className="library-items">
              {componentLibrary.map((item) => (
                <DraggableComponent key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="canvas-container">
            <h2>设计区域 - 支持多组件布局</h2>
            <div className={`canvas-wrapper ${previewMode ? "preview-mode" : ""}`}>
              <Canvas components={components} onDrop={handleDrop} onEdit={handleEdit} onDelete={handleDelete} onMove={handleMove} />
            </div>
          </div>

          <div className="property-panel-container">
            <h2>属性设置</h2>
            <PropertyPanel selectedComponent={selectedComponent} onUpdate={handleUpdate} />
          </div>
        </div>

        <footer>
          <p>React DnD 低代码平台 | 支持同时展示多个组件 | 拖拽布局 | 实时预览</p>
        </footer>
      </div>
    </DndProvider>
  )
}

export default ReactDnd
