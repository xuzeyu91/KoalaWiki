import { Button, Form, Input, Modal, Select, message, Spin, Space } from 'antd';
import { useState, useEffect } from 'react';
import { RepositoryFormValues } from '../types';
import { submitWarehouse } from '../services';
import { fetchOpenAIModels } from '../services/openaiService';
import { ReloadOutlined } from '@ant-design/icons';

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
      const response = await submitWarehouse(values);
      
      if (response.success) {
        message.success('仓库添加成功');
        onSubmit(values);
        form.resetFields();
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
    }
  }, [open]);

  return (
    <Modal
      title="添加仓库"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          提交
        </Button>,
      ]}
      maskClosable={false}
      width={600}
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'git',
          branch: 'main',
          openAIEndpoint: 'https://api.token-ai.cn/v1',
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
          name="type"
          label="仓库类型"
          rules={[{ required: true, message: '请选择仓库类型' }]}
        >
          <Select>
            <Select.Option value="git">Git</Select.Option>
            <Select.Option value="svn">SVN</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="branch"
          label="仓库分支"
          rules={[{ required: true, message: '请输入仓库分支' }]}
        >
          <Input placeholder="请输入仓库分支，例如 main 或 master" />
        </Form.Item>

        <Form.Item
          name="prompt"
          label="构建提示词"
          rules={[{ required: true, message: '请输入构建提示词' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入构建提示词" />
        </Form.Item>
        
        <Form.Item
          name="openAIEndpoint"
          label="OpenAI 端点"
        >
          <Input placeholder="请输入 OpenAI 端点" />
        </Form.Item>

        <Form.Item
          name="openAIKey"
          label="OpenAI 密钥"
          extra={
            <Button 
              type="link" 
              style={{ padding: 0, height: 'auto' }}
              onClick={handleApiConfigChange}
              
            >
              获取可用模型
            </Button>
          }
        >
          <Input.Password placeholder="请输入 OpenAI 密钥" />
        </Form.Item>

        <Form.Item
          name="model"
          label="使用模型"
          rules={[{ required: true, message: '请选择使用的模型' }]}
        >
          {modelsFetching ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Spin size="small" />
              <span>正在获取模型列表...</span>
            </div>
          ) : (
            <Space.Compact style={{ width: '100%' }}>
              <Select
                placeholder={models.length > 0 ? "请选择模型" : "请先配置 API 密钥和端点并获取模型列表"}
                disabled={models.length === 0}
                showSearch
                optionFilterProp="children"
                style={{ width: 'calc(100% - 32px)' }}
              >
                {models.map(model => (
                  <Select.Option key={model} value={model}>
                    {model}
                  </Select.Option>
                ))}
              </Select>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleApiConfigChange}
                disabled={!form.getFieldValue('openAIEndpoint') || !form.getFieldValue('openAIKey')}
                loading={modelsFetching}
              />
            </Space.Compact>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RepositoryForm; 