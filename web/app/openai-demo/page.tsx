'use client';

import React, { useState } from 'react';
import { Card, Typography, Input, Button, Space, message } from 'antd';
import { useOpenAI } from '../context/OpenAIContext';
import OpenAIModelSelector from '../components/OpenAIModelSelector';
import { createChatCompletion } from '../services/openaiService';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function OpenAIDemoPage() {
  const { settings, hasValidSettings } = useOpenAI();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      message.warning('请输入有效的提示');
      return;
    }

    if (!hasValidSettings) {
      message.warning('请先配置 OpenAI 设置');
      return;
    }

    if (!settings.selectedModel) {
      message.warning('请先选择一个模型');
      return;
    }

    setLoading(true);
    try {
      const result = await createChatCompletion(
        settings.endpoint,
        settings.apiKey,
        settings.selectedModel,
        [{ role: 'user', content: prompt }]
      );
      
      setResponse(result.choices[0]?.message?.content || '无响应');
    } catch (error) {
      console.error('Error sending prompt:', error);
      message.error('发送提示时出错');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      <Title level={2}>OpenAI 示例</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>OpenAI 设置状态:</Text>
          <Paragraph>
            {hasValidSettings ? (
              <Text type="success">已配置</Text>
            ) : (
              <Text type="danger">未配置</Text>
            )}
          </Paragraph>
          
          <Text strong>模型选择:</Text>
          <OpenAIModelSelector />
        </Space>
      </Card>
      
      <Card title="测试 OpenAI 模型">
        <Space direction="vertical" style={{ width: '100%' }}>
          <TextArea
            rows={4}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="输入提示..."
            disabled={loading}
          />
          
          <Button 
            type="primary" 
            onClick={handleSendPrompt} 
            loading={loading}
            disabled={!hasValidSettings || !settings.selectedModel}
          >
            发送
          </Button>
          
          {response && (
            <div style={{ marginTop: 16 }}>
              <Text strong>响应:</Text>
              <Card style={{ marginTop: 8 }}>
                <Paragraph>{response}</Paragraph>
              </Card>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
} 