/*
 * @Author: an31742 2234170284@qq.com
 * @Date: 2024-04-02 18:18:01
 * @LastEditors: an31742 2234170284@qq.com
 * @LastEditTime: 2025-07-08 13:36:17
 * @FilePath: /react-todo-list/src/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEN
 */
import "./App.css"
import Home from "./view/home"
import Product from "./view/Product"
import About from "./view/About"
import Test from "./view/test"
//增加天气预报组件
import Weather from "./view/Weather"
import AboutDetails from "./view/AboutDetails"
import ManagingStateClass from "./view/ManagingStateClass"
import PreventRerenderExample from "./view/PreventRerenderExample"
//markeDown 编辑器
import MarkDownEdit from "./view/MarkDownEdit.jsx"
// 购物车
import ShoppingCar from "./view/ShoppingCar"
//MoveSearch
import MoveSearch from "./view/MoveSearch"
//低代码拖拽
import ReactDnd from "./view/ReactDnd"

import { NavLink, Link, Routes, Route, Navigate, useNavigate } from "react-router-dom"
function App() {
  const navigate = useNavigate()
  return (
    <div className="App">
      <header className="App-header">hello world</header>

      {/* 页面顶部跳转按钮 */}
      <div>
        <button onClick={() => navigate("/test")}>Test</button>
        <button onClick={() => navigate("/about/9999")}>详情</button>
        <button onClick={() => navigate("/PreventRerenderExample")}>防止组件重新渲染</button>
        <button onClick={() => navigate("/ManagingStateClass")}>状态管理</button>
      </div>

      {/* 顶部导航栏 */}
      <nav>
        <NavLink to="/MoveSearch">电影搜索</NavLink>
        <NavLink to="/reactDnd">react实现低代码</NavLink>
        <NavLink to="/shoppingCar">购物车</NavLink>
        <NavLink to="/weather">天气</NavLink>
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-active" : "")}>
          Home
        </NavLink>
        <NavLink to="/product/999" state={"From Product"}>
          产品
        </NavLink>
        <NavLink to="/about">关于</NavLink>
        <NavLink to="/markdownEdit">Markdown 编辑器</NavLink>
        <NavLink to="/ManagingStateClass">ManagingStateClass</NavLink>
      </nav>

      {/* 路由展示区域 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:keyword" element={<Product />} />
        <Route path="/about" element={<About />}>
          <Route path=":id" element={<AboutDetails />} />
        </Route>
        <Route path="/weather" element={<Weather />} />
        <Route path="/test" element={<Test />} />
        <Route path="/ManagingStateClass" element={<ManagingStateClass />} />
        <Route path="/PreventRerenderExample" element={<PreventRerenderExample />} />
        <Route path="/markdownEdit" element={<MarkDownEdit />} />
        <Route path="/shoppingCar" element={<ShoppingCar />} />
        <Route path="/MoveSearch" element={<MoveSearch />} />
        <Route path="/reactDnd" element={<ReactDnd />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
