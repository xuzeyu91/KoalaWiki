'use client';

import React from 'react';
import { Card, Typography, Button } from 'antd';
import OpenAISettingsForm from './components/OpenAISettingsForm';

const { Title } = Typography;

export default function OpenAISettingsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      <Title level={2}>OpenAI 设置</Title>
      <Card>
        <OpenAISettingsForm />
      </Card>
    </div>
  );
} 