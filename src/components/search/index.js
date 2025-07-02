/*
 * @Author: an31742 2234170284@qq.com
 * @Date: 2025-07-01 18:14:40
 * @LastEditors: an31742 2234170284@qq.com
 * @LastEditTime: 2025-07-01 22:23:36
 * @FilePath: /react-todo-list/src/components/search/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from "react"
// 定义一个搜索组件，接受一个onSearch函数作为props
// 父组件传过来的对象

const Search = ({ onSearch }) => {
  const [search, setSearch] = useState("")

  const handleInputSearch = (e) => {
    setSearch(e.target.value)
  }
  const handleSearch = (e) => {
    if (search.trim()) onSearch(search)
  }
  return (
    <div>
      <input type="text" value={search} onChange={handleInputSearch} placeholder="请输入城市名称" />
      <button onClick={handleSearch}>搜索</button>
    </div>
  )
}

export default Search
