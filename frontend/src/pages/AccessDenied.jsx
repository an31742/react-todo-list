import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function AccessDenied () {
  const navigate = useNavigate()

  return (
    <Result
      status="403"
      title="403"
      subTitle="当前账号没有访问该页面的权限"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  )
}
