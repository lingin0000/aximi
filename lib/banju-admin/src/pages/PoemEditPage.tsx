import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Space, message, Typography, Card, Tag } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { poemsApi } from '../api/client';

const { Title } = Typography;
const { TextArea } = Input;

const dynastyOptions = ['先秦', '魏晋', '唐', '宋', '元', '明', '清', '五代', '现代'];
const formOptions = ['五绝', '七绝', '五律', '七律', '乐府', '词', '曲', '文', '四古', '五古'];
const tagOptions = [
  '思乡', '送别', '边塞', '山水', '田园', '爱情', '咏物', '哲理',
  '豪放', '婉约', '忧国', '月亮', '秋天', '春天', '冬天', '夏天',
  '隐居', '饮酒', '怀古', '咏史', '节日', '行旅',
];

export default function PoemEditPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadPoem();
    }
  }, [id]);

  async function loadPoem() {
    setLoading(true);
    try {
      const { data } = await poemsApi.getById(Number(id));
      form.setFieldsValue(data.data);
    } catch {
      message.error('加载诗词失败');
    } finally {
      setLoading(false);
    }
  }

  async function onFinish(values: any) {
    setSaving(true);
    try {
      if (isEdit) {
        await poemsApi.update(Number(id), values);
        message.success('更新成功');
      } else {
        await poemsApi.create(values);
        message.success('创建成功');
      }
      navigate('/poems');
    } catch {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/poems')}>
          返回
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          {isEdit ? '编辑诗词' : '添加诗词'}
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          tags: [],
        }}
        style={{ maxWidth: 800 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入诗词标题' }]}
          >
            <Input placeholder="如：静夜思" />
          </Form.Item>

          <Form.Item
            name="author"
            label="作者"
            rules={[{ required: true, message: '请输入作者' }]}
          >
            <Input placeholder="如：李白" />
          </Form.Item>

          <Form.Item
            name="dynasty"
            label="朝代"
            rules={[{ required: true, message: '请选择朝代' }]}
          >
            <Select options={dynastyOptions.map((d) => ({ label: d, value: d }))} placeholder="选择朝代" />
          </Form.Item>

          <Form.Item name="form" label="体裁">
            <Select
              options={formOptions.map((f) => ({ label: f, value: f }))}
              placeholder="选择体裁"
              allowClear
            />
          </Form.Item>
        </div>

        <Form.Item
          name="content"
          label="诗词内容"
          rules={[{ required: true, message: '请输入诗词内容' }]}
        >
          <TextArea rows={8} placeholder="请输入诗词全文，每句一行" />
        </Form.Item>

        <Form.Item name="translation" label="译文">
          <TextArea rows={4} placeholder="请输入白话译文" />
        </Form.Item>

        <Form.Item name="appreciation" label="赏析">
          <TextArea rows={4} placeholder="请输入赏析文字" />
        </Form.Item>

        <Form.Item name="tags" label="标签">
          <Select
            mode="multiple"
            placeholder="选择标签"
            options={tagOptions.map((t) => ({ label: t, value: t }))}
            tagRender={(props) => (
              <Tag closable={props.closable} onClose={props.onClose} style={{ marginRight: 3 }}>
                {props.label}
              </Tag>
            )}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving} size="large">
              {isEdit ? '保存修改' : '创建诗词'}
            </Button>
            <Button onClick={() => navigate('/poems')} size="large">
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
