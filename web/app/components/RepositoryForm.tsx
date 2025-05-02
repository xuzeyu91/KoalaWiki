import { Button, Form, Input, Modal, Select, message, Spin, Space, Switch } from 'antd';
import { useState, useEffect } from 'react';
import { RepositoryFormValues } from '../types';
import { submitWarehouse } from '../services';
import { fetchOpenAIModels } from '../services/openaiService';

interface RepositoryFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: RepositoryFormValues) => void;
}

const RepositoryForm: React.FC<RepositoryFormProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modelsFetching, setModelsFetching] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [enableGitAuth, setEnableGitAuth] = useState(false);

  // 当 API 密钥或端点变更时，尝试获取模型列表
  const handleApiConfigChange = async () => {
    const endpoint = form.getFieldValue('openAIEndpoint');
    const apiKey = form.getFieldValue('openAIKey');

    if (!endpoint || !apiKey) {
      return;
    }

    try {
      setModelsFetching(true);
      const fetchedModels = await fetchOpenAIModels(endpoint, apiKey);
      setModels(fetchedModels);

      // 如果有模型且当前未选择，自动选择第一个
      if (fetchedModels.length > 0 && !form.getFieldValue('model')) {
        form.setFieldValue('model', fetchedModels[0]);
      }

      message.success('成功获取模型列表');
    } catch (error) {
      message.error('获取模型列表失败');
      console.error('Failed to fetch models:', error);
    } finally {
      setModelsFetching(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Call the API service
      const response = await submitWarehouse(values) as any;

      if (response.data.code == 200) {
        message.success('仓库添加成功');
        onSubmit(values);
        form.resetFields();
      } else {
        message.error(response.data.message)
      }
    } catch (error) {
      // Form validation errors are handled automatically
      console.error('Form submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置表单时清空模型列表
  useEffect(() => {
    if (!open) {
      setModels([]);
      setEnableGitAuth(false);
    }
  }, [open]);

  const handleGitAuthChange = (checked: boolean) => {
    setEnableGitAuth(checked);
    if (!checked) {
      form.setFieldsValue({
        gitUserName: undefined,
        gitPassword: undefined
      });
    }
  };

  return (
    <Modal
      title="添加仓库"
      open={open}
      onClose={() => {
        onCancel()
      }}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          提交
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'git',
          branch: 'main',
          openAIEndpoint: 'https://api.token-ai.cn/v1',
          enableGitAuth: false,
        }}
      >
        <Form.Item
          name="address"
          label="仓库地址"
          rules={[{ required: true, message: '请输入仓库地址' }]}
        >
          <Input placeholder="请输入仓库地址" />
        </Form.Item>

        <Form.Item
          name="enableGitAuth"
          label="启用私有化Git验证"
          valuePropName="checked"
        >
          <Switch onChange={handleGitAuthChange} />
        </Form.Item>

        {enableGitAuth && (
          <>
            <Form.Item
              name="gitUserName"
              label="Git用户名"
              rules={[{ required: enableGitAuth, message: '请输入Git用户名' }]}
            >
              <Input placeholder="请输入Git用户名" />
            </Form.Item>

            <Form.Item
              name="gitPassword"
              label="Git密码"
              rules={[{ required: enableGitAuth, message: '请输入Git密码' }]}
            >
              <Input.Password placeholder="请输入Git密码" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Git邮箱"
              rules={[
                { required: enableGitAuth, message: '请输入Git邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入Git邮箱" />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="openAIEndpoint"
          label="OpenAI 端点"
        >
          <Input
            placeholder="请输入 OpenAI 端点" />
        </Form.Item>

        <Form.Item
          name="openAIKey"
          rules={[{ required: true, message: '请输入 OpenAI 密钥' }]}
          label="OpenAI 密钥"
        >
          <Input.Password placeholder="请输入 OpenAI 密钥" />
        </Form.Item>

        <Form.Item
          name="model"
          label="使用模型"
          rules={[{ required: true, message: '请选择使用的模型' }]}
        >
          <Select
            options={[
              {
                label: 'gpt-4.1',
                value: 'gpt-4.1',
              },
              {
                label: 'gpt-4o',
                value: 'gpt-4o',
              },
              {
                label: 'gpt-4o-mini',
                value: 'gpt-4o-mini',
              },
              {
                label: 'gpt-4.1-mini',
                value: 'gpt-4.1-mini',
              },
              {
                label: 'QwQ-32B',
                value: 'QwQ-32B',
              },
              {
                label: 'o4-mini',
                value: 'o4-mini',
              },
              {
                label: 'o3-mini',
                value: 'o3-mini',
              },
              {
                label: 'doubao-1-5-pro-256k-250115',
                value: 'doubao-1-5-pro-256k-250115',
              },
              {
                label: 'DeepSeek-V3',
                value: 'DeepSeek-V3',
              },
            ]}
          >
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RepositoryForm; 