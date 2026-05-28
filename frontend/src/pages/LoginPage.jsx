import React, { useState } from 'react';
import { Form, Input, Button, message, Tabs, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';

const LoginPage = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const saveToken = (token, remember) => {
    if (remember) {
      localStorage.setItem('token', token)
      localStorage.setItem('rememberMe', 'true')
    } else {
      sessionStorage.setItem('token', token)
    }
  }

  const onLogin = async (values) => {
    try {
      setLoading(true);
      const { rememberMe, ...loginValues } = values
      const response = await axios.post('/api/auth/login', loginValues);
      message.success('登录成功');
      saveToken(response.data.token, rememberMe)
      onLoginSuccess(response.data);
    } catch (error) {
      message.error('登录失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values) => {
    try {
      setLoading(true);
      const { rememberMe, ...registerValues } = values
      const response = await axios.post('/api/auth/register', registerValues);
      message.success('注册成功');
      saveToken(response.data.token, rememberMe)
      onLoginSuccess(response.data);
    } catch (error) {
      message.error('注册失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'login',
      label: '登录',
      children: (
        <Form onFinish={onLogin} size="large" layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }]} style={{ marginBottom: 20 }}>
            <Input
              prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
              placeholder="邮箱"
              style={{ borderRadius: 10, height: 46, paddingLeft: 14 }}
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]} style={{ marginBottom: 8 }}>
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="密码"
              style={{ borderRadius: 10, height: 46, paddingLeft: 14 }}
            />
          </Form.Item>
          <Form.Item name="rememberMe" valuePropName="checked" style={{ marginBottom: 16 }}>
            <Checkbox style={{ color: '#64748b' }}>记住我</Checkbox>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: 46,
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <Form onFinish={onRegister} size="large" layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]} style={{ marginBottom: 20 }}>
            <Input
              prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
              placeholder="用户名"
              style={{ borderRadius: 10, height: 46, paddingLeft: 14 }}
            />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }]} style={{ marginBottom: 20 }}>
            <Input
              prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
              placeholder="邮箱"
              style={{ borderRadius: 10, height: 46, paddingLeft: 14 }}
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]} style={{ marginBottom: 8 }}>
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="密码"
              style={{ borderRadius: 10, height: 46, paddingLeft: 14 }}
            />
          </Form.Item>
          <Form.Item name="rememberMe" valuePropName="checked" style={{ marginBottom: 16 }}>
            <Checkbox style={{ color: '#64748b' }}>记住我</Checkbox>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: 46,
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div style={styles.wrapper}>
      {/* Left Brand Panel */}
      <div style={styles.brandPanel}>
        {/* Decorative bg orbs */}
        <div style={styles.orb1} />
        <div style={styles.orb2} />
        <div style={styles.orb3} />

        <div style={styles.brandContent}>
          <div style={styles.logo}>R</div>
          <h1 style={styles.brandTitle}>React Admin</h1>
          <p style={styles.brandDesc}>
            全栈管理后台 · 权限控制 · 数据可视化 · CRUD 一体化
          </p>
          <div style={styles.featureList}>
            {['React 18 + Redux Toolkit', 'Ant Design 5 主题系统', 'ECharts 数据驾驶舱'].map((item) => (
              <div key={item} style={styles.featureItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={styles.formPanel}>
        <div style={styles.formContainer}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {activeTab === 'login' ? '欢迎回来' : '创建账户'}
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#64748b', marginTop: 6 }}>
              {activeTab === 'login' ? '请登录你的账户以继续' : '注册一个新账户开始使用'}
            </p>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            items={tabItems}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f6f8fc',
    fontFamily: "'DM Sans', sans-serif",
  },
  brandPanel: {
    flex: 1,
    background: 'linear-gradient(160deg, #0c1222 0%, #151b30 40%, #0f2027 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 40px',
    position: 'relative',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute',
    width: 480,
    height: 480,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)',
    top: '-15%',
    right: '-10%',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)',
    bottom: '-10%',
    left: '-8%',
    pointerEvents: 'none',
  },
  orb3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)',
    top: '40%',
    left: '20%',
    pointerEvents: 'none',
  },
  brandContent: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    color: '#f1f5f9',
    maxWidth: 400,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    background: 'linear-gradient(135deg, #10b981, #059669)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    fontSize: 28,
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: '#fff',
    boxShadow: '0 8px 32px rgba(16,185,129,0.35)',
  },
  brandTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 34,
    fontWeight: 700,
    margin: '0 0 10px',
    letterSpacing: '-0.5px',
  },
  brandDesc: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 1.6,
    marginBottom: 36,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    textAlign: 'left',
    maxWidth: 280,
    margin: '0 auto',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: 500,
  },
  formPanel: {
    width: 500,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '40px 60px',
  },
  formContainer: {
    maxWidth: 380,
    margin: '0 auto',
    width: '100%',
  },
};

export default LoginPage;