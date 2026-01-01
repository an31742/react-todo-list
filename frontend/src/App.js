import "./App.css"
import axios from 'axios'
import { Menu, Layout, message } from 'antd'
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import store from './store'
import { HomeOutlined, CheckSquareOutlined, BookOutlined, ShoppingCartOutlined, EditOutlined, DragOutlined, SearchOutlined, CloudOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons'
import Home from "./pages/home"
import TodoPage from "./pages/TodoPage"
import Product from "./pages/Product"
import About from "./pages/About"
import Test from "./pages/test"
import Weather from "./pages/Weather"
import AboutDetails from "./pages/AboutDetails"
import ManagingStateClass from "./pages/ManagingStateClass"
import PreventRerenderExample from "./pages/PreventRerenderExample"
import MarkDownEdit from "./pages/MarkDownEdit.jsx"
import ShoppingCar from "./pages/ShoppingCar"
import MoveSearch from "./pages/MoveSearch"
import ReactDnd from "./pages/ReactDnd"
import ReduxShoppingCart from "./pages/ReduxShoppingCart"
import Job from "./pages/job"
import LoginPage from "./pages/LoginPage"
import CollaborativeBoard from "./pages/CollaborativeBoard"
import BookCardList from "./pages/book/BookCardList.jsx"

const { Header, Content } = Layout

function App () {
  //使用useNavigate
  const navigate = useNavigate()
  //使用本地缓存
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  //增加目录list
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/TodoPage',
      icon: <CheckSquareOutlined />,
      label: 'Todo管理',
    },
    {
      key: '/CollaborativeBoard',
      icon: <CheckSquareOutlined />,
      label: '协作看板',
    },
    {
      key: 'features',
      icon: <BookOutlined />,
      label: '功能模块',
      children: [
        {
          key: '/BookCardList',
          icon: <BookOutlined />,
          label: '图书管理',
        },
        {
          key: '/ReduxShoppingCart',
          icon: <ShoppingCartOutlined />,
          label: 'Redux购物车',
        },
        {
          key: '/shoppingCar',
          icon: <ShoppingCartOutlined />,
          label: '购物车',
        },
        {
          key: '/markdownEdit',
          icon: <EditOutlined />,
          label: 'Markdown编辑器',
        },
        {
          key: '/reactDnd',
          icon: <DragOutlined />,
          label: '拖拽组件',
        },
      ],
    },
    {
      key: 'demo',
      icon: <SearchOutlined />,
      label: '示例页面',
      children: [
        {
          key: '/MoveSearch',
          icon: <SearchOutlined />,
          label: '电影搜索',
        },
        {
          key: '/weather',
          icon: <CloudOutlined />,
          label: '天气应用',
        },
        {
          key: '/Job',
          icon: <UserOutlined />,
          label: '前端职位',
        },
      ],
    },
  ]

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }
  const handleLoginOut = async () => {
    const token = localStorage.getItem('token')

    if (token) {
      const loginOut = await axios.post('/api/auth/loginOut', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      console.log("🚀 ~ handleLoginOut ~ loginOut:", loginOut)
      message.success('退出成功')
    }
    navigate('/login')
    localStorage.setItem('token', '')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  })
  if (!isLoggedIn) {
    return <LoginPage />
  }
  return (
    <Provider store={store}>
      <Layout style={{ minHeight: '100vh' }} >
      {/* 头部 */}
      <Header style={{ padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginLeft: '24px', marginRight: '40px' }}>
            React Todo 学习项目
          </div>
          {/* 内容 */}
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            // onClick	点击 MenuItem 调用此函数  key, keyPath, domEvent
            onClick={handleMenuClick}
            style={{ flex: 1, minWidth: 0 }}
          />

          <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginLeft: '24px', marginRight: '40px' }} onClick={handleLoginOut}>
            退出登录
          </div>
        </div>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
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
          <Route path="/Job" element={<Job />} />
          <Route path="/ReduxShoppingCart" element={<ReduxShoppingCart />} />
          <Route path="/BookCardList" element={<BookCardList />} />
          <Route path="/TodoPage" element={<TodoPage />} />
          <Route path="/*" element={<Navigate to="/" />} />
          <Route path="/CollaborativeBoard" element={<CollaborativeBoard />} />
        </Routes>
      </Content>
    </Layout>
    </Provider>
  )
}

export default App