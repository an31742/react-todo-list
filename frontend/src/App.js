import "./App.css"
import axios from 'axios'
import { Menu, Layout, message, Image, Dropdown, Upload } from 'antd'
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import store from './store'
import { HomeOutlined, CheckSquareOutlined, BookOutlined, UserOutlined } from '@ant-design/icons'
import Home from "./pages/home"
import TodoPage from "./pages/TodoPage"
import Product from "./pages/Product"
import About from "./pages/About"
import Test from "./pages/test"
import AboutDetails from "./pages/AboutDetails"
import ManagingStateClass from "./pages/ManagingStateClass"
import PreventRerenderExample from "./pages/PreventRerenderExample"
import LoginPage from "./pages/LoginPage"
// import CollaborativeBoard from "./pages/CollaborativeBoard"
import BookCardList from "./pages/book/BookCardList.jsx"

const { Header, Content } = Layout

function App () {
  //使用useNavigate
  const navigate = useNavigate()
  //使用本地缓存
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null) // 初始为空
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
    // {
    //   key: '/CollaborativeBoard',
    //   icon: <CheckSquareOutlined />,
    //   label: '协作看板',
    // },
    {
      key: '/BookCardList',
      icon: <BookOutlined />,
      label: '图书管理',
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
    
    // 获取用户头像
    if (token) {
      fetchUserProfile()
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      // 如果有头像就使用，没有就使用默认头像
      setAvatarUrl(response.data.avatar || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 失败时也设置默认头像
      setAvatarUrl('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')
    }
  }

  const updateUserAvatar = async (avatarUrl) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/auth/profile', 
        { avatar: avatarUrl },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
    } catch (error) {
      console.error('更新用户头像失败:', error)
    }
  }
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


            {/* 头像上传暂时注释（Vercel 不支持文件持久化）
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'upload',
                    label: (
                      <Upload
                        name="avatar"
                        showUploadList={false}
                        action="/api/upload/avatar"
                        beforeUpload={(file) => {
                          const isImage = file.type.startsWith('image/')
                          if (!isImage) message.error('只能上传图片文件!')
                          return isImage
                        }}
                        onChange={(info) => {
                          if (info.file.status === 'done') {
                            message.success('头像上传成功!')
                            setAvatarUrl(info.file.response.url)
                            updateUserAvatar(info.file.response.url)
                          } else if (info.file.status === 'error') {
                            message.error('头像上传失败!')
                          }
                        }}
                      >
                        更换头像
                      </Upload>
                    ),
                  },
                  { key: 'profile', label: '个人资料' },
                  { key: 'logout', label: '退出登录', onClick: handleLoginOut },
                ],
              }}
              trigger={['click']}
            >
              <Image
                width={50} height={50}
                style={{ borderRadius: '25px', cursor: 'pointer' }}
                alt="avatar"
                src={avatarUrl || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'}
              />
            </Dropdown>
            */}
            <Dropdown
              menu={{
                items: [
                  { key: 'logout', label: '退出登录', onClick: handleLoginOut },
                ],
              }}
              trigger={['click']}
            >
              <Image
                width={50}
                height={50}
                style={{ borderRadius: '25px', cursor: 'pointer' }}
                alt="avatar"
                src={avatarUrl || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'}
              />
            </Dropdown>

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
            <Route path="/test" element={<Test />} />
            <Route path="/ManagingStateClass" element={<ManagingStateClass />} />
            <Route path="/PreventRerenderExample" element={<PreventRerenderExample />} />
            <Route path="/BookCardList" element={<BookCardList />} />
            <Route path="/TodoPage" element={<TodoPage />} />
            <Route path="/*" element={<Navigate to="/" />} />
            {/* <Route path="/CollaborativeBoard" element={<CollaborativeBoard />} /> */}
          </Routes>
        </Content>
      </Layout>
    </Provider>
  )
}

export default App