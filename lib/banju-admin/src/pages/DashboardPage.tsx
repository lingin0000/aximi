import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  HeartOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { poemsApi } from '../api/client';

const { Title } = Typography;

export default function DashboardPage() {
  const [stats, setStats] = useState({
    poems: 0,
    users: 0,
    favorites: 0,
    authors: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [poemsRes] = await Promise.all([
        poemsApi.list({ pageSize: 1 }),
      ]);
      setStats({
        poems: poemsRes.data.data?.total || 0,
        users: 0,
        favorites: 0,
        authors: 0,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        仪表盘
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="诗词总数"
              value={stats.poems}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#2C5F2D' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="注册用户"
              value={stats.users}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="收藏总数"
              value={stats.favorites}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="作者数量"
              value={stats.authors}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#D4AF37' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="快速入口">
            <div className="space-y-3">
              <p className="text-gray-500">📖 查看和管理所有诗词</p>
              <p className="text-gray-500">✏️ 添加新的诗词作品</p>
              <p className="text-gray-500">👥 管理用户和数据</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="系统信息">
            <div className="space-y-3">
              <p className="text-gray-500">🟢 系统运行正常</p>
              <p className="text-gray-500">🕐 数据同步状态：实时</p>
              <p className="text-gray-500">
                📊 数据库：PostgreSQL
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
