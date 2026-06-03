import { useEffect, useState } from 'react';
import { Table, Tag, Typography, message } from 'antd';
import { usersApi } from '../api/client';

const { Title } = Typography;

export default function UserListPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    loadUsers();
  }, [pagination.current]);

  async function loadUsers() {
    setLoading(true);
    try {
      const { data } = await usersApi.list({
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      setUsers(data.data?.items || []);
      setPagination((p) => ({
        ...p,
        total: data.data?.total || 0,
      }));
    } catch {
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      ellipsis: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 150,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (text: string) => (text ? new Date(text).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const isActive = !status || status === 'active';
        return (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? '正常' : '已禁用'}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        用户管理
      </Title>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 个用户`,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize, total: pagination.total }),
        }}
      />
    </div>
  );
}
