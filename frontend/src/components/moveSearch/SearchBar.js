import { useState } from "react"

// 这里需要注意，React 组件的 props 应该是一个对象
// 所以应该用 props 结构出 onSearch
const SearchBar = (props) => {
  const { onSearch } = props
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    if (query.trim()) {
      if (typeof onSearch === "function") {
        console.log("query", query)
        onSearch(query) // 把搜索关键词传回父组件
      } else {
        // 不是函数时给出警告
        console.warn("onSearch 不是一个函数，请检查父组件传递的 props")
      }
    }
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="请输入电影名称"
      />
      <button onClick={handleSearch} style={{ marginLeft: "20px" }}>
        搜索
      </button>
    </div>
  )
}

export default SearchBar
