'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, message, Select, Typography, Spin } from 'antd';
import { fetchOpenAIModels } from '../../../services/openaiService';
import { useOpenAI } from '../../../context/OpenAIContext';

const { Text } = Typography;
const { Option } = Select;

interface OpenAISettings {
  endpoint: string;
  apiKey: string;
}

const OpenAISettingsForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [showModels, setShowModels] = useState(false);
  
  const { settings, updateSettings } = useOpenAI();

  // Load settings from context
  useEffect(() => {
    form.setFieldsValue({
      endpoint: settings.endpoint,
      apiKey: settings.apiKey,
    });
  }, [form, settings.endpoint, settings.apiKey]);

  const saveSettings = (values: OpenAISettings) => {
    updateSettings({
      endpoint: values.endpoint,
      apiKey: values.apiKey,
    });
    message.success('设置已保存');
  };

  const handleFetchModels = async () => {
    try {
      setLoading(true);
      setShowModels(true);
      
      const values = form.getFieldsValue();
      saveSettings(values);
      
      const fetchedModels = await fetchOpenAIModels(values.endpoint, values.apiKey);
      setModels(fetchedModels);
      
      if (fetchedModels.length > 0) {
        updateSettings({ selectedModel: fetchedModels[0] });
      }
      
      message.success('成功获取模型列表');
    } catch (error) {
      message.error('获取模型列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (value: string) => {
    updateSettings({ selectedModel: value });
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          endpoint: 'https://api.openai.com/v1',
        }}
        onFinish={saveSettings}
      >
        <Form.Item
          label="OpenAI API 端点"
          name="endpoint"
          rules={[{ required: true, message: '请输入 OpenAI API 端点' }]}
        >
          <Input placeholder="https://api.openai.com/v1" />
        </Form.Item>

        <Form.Item
          label="API 密钥"
          name="apiKey"
          rules={[{ required: true, message: '请输入 API 密钥' }]}
        >
          <Input.Password placeholder="sk-..." />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
            <Button onClick={handleFetchModels}>
              获取可用模型
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {showModels && (
        <div style={{ marginTop: 24 }}>
          <Text strong>选择模型</Text>
          <div style={{ marginTop: 12 }}>
            {loading ? (
              <Spin tip="加载模型中..." />
            ) : (
              <Select
                style={{ width: '100%' }}
                value={settings.selectedModel}
                onChange={handleModelChange}
                placeholder="选择一个模型"
                disabled={models.length === 0}
              >
                {models.map(model => (
                  <Option key={model} value={model}>
                    {model}
                  </Option>
                ))}
              </Select>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenAISettingsForm; 