/*
 * @Author: an31742 2234170284@qq.com
 * @Date: 2024-04-02 18:18:01
 * @LastEditors: an31742 2234170284@qq.com
 * @LastEditTime: 2025-07-03 01:55:38
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
import { NavLink, Link, Routes, Route, Navigate, useNavigate } from "react-router-dom"
function App() {
  const navigate = useNavigate()
  return (
    <div className="App">
      <button onClick={() => navigate("/test")}>Test</button>
      <button onClick={() => navigate("/about/9999")}>详情</button>
      <button onClick={() => navigate("/PreventRerenderExample")}>防止组件重新渲染</button>
      <button onClick={() => navigate("/ManagingStateClass")}>状态管理</button>
      <header className="App-header">hello world</header>
      <nav>
        <NavLink to="/shoppingCar">ShoppingCar</NavLink>
        <NavLink to="/weather">Weather</NavLink>
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-active" : "")}>
          Home
        </NavLink>
        <NavLink
          to={{
            pathname: "/product/999",
            search: "?sort=date",
            hash: "#hash",
          }}
          state={"From Product"}
        >
          产品
        </NavLink>
        <NavLink to="/about">关于</NavLink>
        <NavLink to="/markdownEdit">markDown编辑器</NavLink>
        <Link
          to={{
            pathname: "/settings",
            search: "?sort=date",
            hash: "#hash",
          }}
          className={({ isActive }) => (isActive ? "nav-active" : "")}
        >
          link
        </Link>
        <Link
          to={{
            pathname: "/ManagingStateClass",
            search: "?sort=date",
            hash: "#hash",
          }}
          className={({ isActive }) => (isActive ? "nav-active" : "")}
        >
          ManagingStateClass
        </Link>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:keyword" element={<Product />} />
          <Route path="/about" element={<About />}>
            <Route path=":id" element={<AboutDetails />} />
          </Route>
          {/* <Route path="/about/*" element={<AboutDetails />} /> */}
          <Route path="/*" element={<Navigate to="" />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/test" element={<Test />} />
          <Route path="/ManagingStateClass" element={<ManagingStateClass />} />
          <Route path="/PreventRerenderExample" element={<PreventRerenderExample />} />
          <Route path="/markdownEdit" element={<MarkDownEdit />} />
          <Route path="/shoppingCar" element={<ShoppingCar />} />
        </Routes>
      </nav>
    </div>
  )
}

export default App
