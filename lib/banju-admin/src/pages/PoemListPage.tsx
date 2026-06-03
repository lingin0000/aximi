import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Input, Tag, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { poemsApi } from '../api/client';

const { Title } = Typography;

const dynastyColors: Record<string, string> = {
  唐: 'gold', 宋: 'purple', 元: 'blue', 明: 'cyan',
  清: 'geekblue', 先秦: 'orange', 魏晋: 'green', 五代: 'lime',
};

export default function PoemListPage() {
  const [poems, setPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    loadPoems();
  }, [pagination.current]);

  async function loadPoems() {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current,
        pageSize: pagination.pageSize,
      };
      if (search.trim()) {
        const { data: searchData } = await poemsApi.search(search.trim());
        setPoems(searchData.data?.items || []);
        setPagination((p) => ({
          ...p,
          total: searchData.data?.total || 0,
        }));
      } else {
        const { data } = await poemsApi.list(params);
        setPoems(data.data?.items || []);
        setPagination((p) => ({
          ...p,
          total: data.data?.total || 0,
        }));
      }
    } catch (err) {
      message.error('加载诗词列表失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await poemsApi.delete(id);
      message.success('删除成功');
      loadPoems();
    } catch {
      message.error('删除失败');
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 200,
      render: (text: string, record: any) => (
        <span className="font-medium cursor-pointer hover:text-green-700" onClick={() => navigate(`/poems/${record.id}/edit`)}>
          {text}
        </span>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      width: 100,
    },
    {
      title: '朝代',
      dataIndex: 'dynasty',
      width: 80,
      render: (text: string) => (
        <Tag color={dynastyColors[text] || 'default'}>{text}</Tag>
      ),
    },
    {
      title: '体裁',
      dataIndex: 'form',
      width: 80,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <Space size={4} wrap>
          {tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '内容预览',
      dataIndex: 'content',
      ellipsis: true,
      render: (text: string) => (
        <span className="text-gray-500">{text?.replace(/\n/g, ' ').slice(0, 30)}...</span>
      ),
    },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/poems/${record.id}/edit`)}
          />
          <Popconfirm
            title="确定删除这首诗词？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Title level={4} style={{ margin: 0 }}>
          诗词管理
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/poems/new')}
        >
          添加诗词
        </Button>
      </div>

      <div className="mb-4">
        <Input.Search
          placeholder="搜索诗词标题、作者、内容..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={() => {
            setPagination((p) => ({ ...p, current: 1 }));
            loadPoems();
          }}
          enterButton={<SearchOutlined />}
          style={{ maxWidth: 400 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={poems}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 首`,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize, total: pagination.total }),
        }}
        scroll={{ x: 900 }}
      />
    </div>
  );
}
