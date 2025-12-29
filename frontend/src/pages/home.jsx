import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import TodoPage from './TodoPage';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'Todo管理', desc: '基础的增删改查功能', path: '/todos' },
    { title: '用户认证', desc: '登录注册系统', path: '/auth' },
    { title: '图书管理', desc: 'MongoDB数据操作', path: '/BookCardList' },
    { title: '购物车', desc: 'Redux状态管理', path: '/ReduxShoppingCart' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>React + Node.js 全栈学习项目</h1>
        <p>通过实际项目学习现代前后端开发技术</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '40px' }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              title={feature.title}
              hoverable
              actions={[
                <Button type="link" onClick={() => navigate(feature.path)}>
                  查看详情
                </Button>
              ]}
            >
              <p>{feature.desc}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <TodoPage />
    </div>
  );
};

export default Home;