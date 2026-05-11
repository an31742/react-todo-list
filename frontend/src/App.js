import './App.css'
import axios from 'axios'
import { Menu, Layout, message, Dropdown, Tag, Avatar } from 'antd'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { Provider } from 'react-redux'
import store from './store'
import {
  HomeOutlined,
  CheckSquareOutlined,
  BookOutlined,
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
  ReadOutlined,
  DownOutlined,
} from '@ant-design/icons'
import Home from './pages/home'
import TodoPage from './pages/TodoPage'
import Product from './pages/Product'
import About from './pages/About'
import Test from './pages/test'
import AboutDetails from './pages/AboutDetails'
import ManagingStateClass from './pages/ManagingStateClass'
import PreventRerenderExample from './pages/PreventRerenderExample'
import LoginPage from './pages/LoginPage'
import BookCardList from './pages/book/BookCardList.jsx'
import AccessDenied from './pages/AccessDenied'


//增加页面布局
const { Header, Content, Sider } = Layout

//设置权限菜单
const ROLE_PERMISSIONS = {
  admin: ['*'],
  editor: ['dashboard.view', 'todo.view', 'book.view', 'example.view'],
  viewer: ['dashboard.view', 'todo.view'],
}


//菜单树设置菜单
const MENU_TREE = [
  {
    key: 'dashboard',
    icon: <AppstoreOutlined />,
    label: '工作台',
    children: [
      { key: '/', icon: <HomeOutlined />, label: '首页', permission: 'dashboard.view' },
    ],
  },
  {
    key: 'task-center',
    icon: <CheckSquareOutlined />,
    label: '任务中心',
    children: [
      { key: '/TodoPage', icon: <CheckSquareOutlined />, label: 'Todo管理', permission: 'todo.view' },
      { key: '/BookCardList', icon: <BookOutlined />, label: '图书管理', permission: 'book.view' },
    ],
  },
  {
    key: 'examples',
    icon: <ReadOutlined />,
    label: '示例页面',
    children: [
      { key: '/about', icon: <ReadOutlined />, label: '关于页面', permission: 'example.view' },
      { key: '/test', icon: <ReadOutlined />, label: '测试页面', permission: 'example.view' },
    ],
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: '/ManagingStateClass', icon: <SettingOutlined />, label: '状态管理', permission: 'system.view' },
      { key: '/PreventRerenderExample', icon: <SettingOutlined />, label: '性能优化', permission: 'system.view' },
    ],
  },
]
//判断权限方法是否有权限有权限就会返回true
function hasPermission (role, permission) {
  if (!permission) return true
  const list = ROLE_PERMISSIONS[role] || []
  return list.includes('*') || list.includes(permission)
}


//过滤掉菜单权限树   根据菜单树和就角色就可以过滤掉组织数
function filterMenuByRole (menuTree, role) {
  return menuTree
    .map((item) => {
      if (!item.children) {
        return hasPermission(role, item.permission) ? item : null
      }

      const children = item.children.filter((child) => hasPermission(role, child.permission))
      if (!children.length) return null
      return { ...item, children }
    })
    .filter(Boolean)
}

function canAccessPath (role, path) {
  for (const group of MENU_TREE) {
    const match = group.children?.find((item) => item.key === path)
    if (match) return hasPermission(role, match.permission)
  }

  if (path.startsWith('/about/')) {
    return hasPermission(role, 'example.view')
  }

  return true
}



//首页菜单展示
function App () {

  //设置useNavigate 路由跳转
  const navigate = useNavigate()
  //获取路由信息
  const location = useLocation()
  //设置判断是否登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  //设置角色信息
  const [userProfile, setUserProfile] = useState({ role: 'viewer', username: '' })
  //设置openkey  菜单树唯一的节点
  const [openKeys, setOpenKeys] = useState(['dashboard'])
   //拿到过滤后的组织树
  const filteredMenuItems = useMemo(() => {
    return filterMenuByRole(MENU_TREE, userProfile.role)
  }, [userProfile.role])
   //拿到匹配的openkey
  const matchedOpenKeys = useMemo(() => {
    for (const group of filteredMenuItems) {
      if (group.children?.some((child) => location.pathname === child.key || location.pathname.startsWith(`${child.key}/`))) {
        return [group.key]
      }
    }
    return ['dashboard']
  }, [filteredMenuItems, location.pathname])

  //获取到点击几点
  const selectedKey = useMemo(() => {
    for (const group of filteredMenuItems) {
      const match = group.children?.find((child) => location.pathname === child.key || location.pathname.startsWith(`${child.key}/`))
      if (match) return match.key
    }
    return '/'
  }, [filteredMenuItems, location.pathname])


  //菜单点击就会根据key进行跳转
  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  const handleLoginOut = async () => {

    //调用退出登录接口退出登录
    const token = localStorage.getItem('token')

    try {
      if (token) {
        await axios.post('/api/auth/loginOut', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
      message.success('退出成功')
    } catch (error) {
      console.error('退出登录失败:', error)
      message.warning('退出接口异常，已本地退出')
    } finally {
      localStorage.setItem('token', '')
      setIsLoggedIn(false)
      navigate('/login')
    }
  }
//是副作用函数是调用接口的
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    if (token) {
      fetchUserProfile()
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [location.pathname])

  useEffect(() => {
    setOpenKeys(matchedOpenKeys)
  }, [matchedOpenKeys])
  //根据token和用户信息展示不一样的数据
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUserProfile({
        username: response.data.username || '',
        role: response.data.role || 'viewer',
      })
      setAvatarUrl(response.data.avatar || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')
    } catch (error) {
      console.error('获取用户信息失败:', error)
      setAvatarUrl('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')
      setUserProfile({ role: 'viewer', username: '' })
    }
  }

  const Guard = ({ path, children }) => {
    if (!canAccessPath(userProfile.role, path)) {
      return <AccessDenied />
    }
    return children
  }

  if (!isLoggedIn) {
    return <LoginPage />
  }

  return (

    //配置群居provider  使用store
    <Provider store={store}>
      <Layout className="admin-layout">
        <Sider width={220} className="admin-sider" breakpoint="lg" collapsedWidth="64">
          <div className="admin-logo">
            <UserOutlined style={{ marginRight: 8 }} />
            管理后台
          </div>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['dashboard']}
            openKeys={openKeys}
            onOpenChange={(keys) => setOpenKeys(keys)}
            items={filteredMenuItems}
            onClick={handleMenuClick}
            className="admin-menu"
          />
        </Sider>

        <Layout>
          <Header className="admin-header">
            <Dropdown
              menu={{
                items: [{ key: 'logout', label: '退出登录', onClick: handleLoginOut }],
              }}
              trigger={['click']}
            >
              <div className="admin-user-entry">
                <Avatar
                  size={44}
                  className="admin-avatar"
                  icon={<UserOutlined />}
                  src={avatarUrl || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'}
                />
                <div className="admin-user-meta">
                  <div className="admin-user-name">{userProfile.username || '当前用户'}</div>
                  <Tag className="admin-role-tag">{userProfile.role}</Tag>
                </div>
                <DownOutlined className="admin-user-arrow" />
              </div>
            </Dropdown>
          </Header>

          <Content className="admin-content">
            <div className="admin-content-inner">
              <Routes>
                <Route path="/" element={<Guard path="/"><Home /></Guard>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/product/:keyword" element={<Product />} />
                <Route path="/about" element={<Guard path="/about"><About /></Guard>}>
                  <Route path=":id" element={<Guard path="/about"><AboutDetails /></Guard>} />
                </Route>
                <Route path="/test" element={<Guard path="/test"><Test /></Guard>} />
                <Route path="/ManagingStateClass" element={<Guard path="/ManagingStateClass"><ManagingStateClass /></Guard>} />
                <Route path="/PreventRerenderExample" element={<Guard path="/PreventRerenderExample"><PreventRerenderExample /></Guard>} />
                <Route path="/BookCardList" element={<Guard path="/BookCardList"><BookCardList /></Guard>} />
                <Route path="/TodoPage" element={<Guard path="/TodoPage"><TodoPage /></Guard>} />
                <Route path="/403" element={<AccessDenied />} />
                <Route path="/*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Provider>
  )
}

export default App
