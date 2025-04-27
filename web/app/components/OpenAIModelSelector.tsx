'use client';

import React, { useState, useEffect } from 'react';
import { Select, Button, Spin, message, Typography, Space } from 'antd';
import { useOpenAI } from '../context/OpenAIContext';
import { fetchOpenAIModels } from '../services/openaiService';
import { useRouter } from 'next/navigation';

const { Option } = Select;
const { Text } = Typography;

interface OpenAIModelSelectorProps {
  onModelSelect?: (model: string) => void;
}

const OpenAIModelSelector: React.FC<OpenAIModelSelectorProps> = ({ 
  onModelSelect 
}) => {
  const router = useRouter();
  const { settings, updateSettings, hasValidSettings } = useOpenAI();
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);

  const handleFetchModels = async () => {
    if (!hasValidSettings) {
      message.warning('请先配置 OpenAI 设置');
      router.push('/settings/openai');
      return;
    }

    try {
      setLoading(true);
      const fetchedModels = await fetchOpenAIModels(settings.endpoint, settings.apiKey);
      setModels(fetchedModels);
      
      if (fetchedModels.length > 0 && !settings.selectedModel) {
        const firstModel = fetchedModels[0];
        updateSettings({ selectedModel: firstModel });
        onModelSelect?.(firstModel);
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
    onModelSelect?.(value);
  };

  useEffect(() => {
    // If we have valid settings but no models yet, automatically fetch models
    if (hasValidSettings && models.length === 0 && !loading) {
      handleFetchModels();
    }
  }, [hasValidSettings]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hasValidSettings) {
    return (
      <div>
        <Space>
          <Text type="warning">请先配置 OpenAI 设置</Text>
          <Button type="primary" onClick={() => router.push('/settings/openai')}>
            前往设置
          </Button>
        </Space>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Text>模型:</Text>
      {loading ? (
        <Spin size="small" />
      ) : (
        <Select
          style={{ width: 200 }}
          value={settings.selectedModel}
          onChange={handleModelChange}
          placeholder="选择一个模型"
          disabled={loading || models.length === 0}
        >
          {models.map(model => (
            <Option key={model} value={model}>
              {model}
            </Option>
          ))}
        </Select>
      )}
      <Button
        size="small"
        onClick={handleFetchModels}
        loading={loading}
      >
        刷新
      </Button>
    </div>
  );
};

export default OpenAIModelSelector; 