'use client';
import { useState } from 'react';
import { Button, Typography, Layout, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import RepositoryForm from './components/RepositoryForm';
import RepositoryList from './components/RepositoryList';
import { Repository, RepositoryFormValues } from './types';

const { Content } = Layout;
const { Title } = Typography;

// 模拟数据，实际应用中应从API获取
const MOCK_REPOSITORIES: Repository[] = [
  {
    id: '1',
    name: 'React',
    address: 'https://github.com/facebook/react',
    type: 'git',
    prompt: '分析React源码',
    model: 'gpt-4',
    openAIKey: '',
    openAIEndpoint: '',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Next.js',
    address: 'https://github.com/vercel/next.js',
    type: 'git',
    prompt: '分析Next.js源码',
    model: 'gpt-4',
    openAIKey: '',
    openAIEndpoint: '',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>(MOCK_REPOSITORIES);
  const [formVisible, setFormVisible] = useState(false);

  const handleAddRepository = (values: RepositoryFormValues) => {
    // 在实际应用中，应该调用API添加仓库
    const newRepository: Repository = {
      id: Date.now().toString(),
      name: values.address.split('/').pop() || 'New Repository',
      address: values.address,
      type: values.type,
      prompt: values.prompt,
      model: values.model,
      openAIKey: values.openAIKey,
      openAIEndpoint: values.openAIEndpoint,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRepositories([...repositories, newRepository]);
    setFormVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={2}>Koala Wiki 仓库列表</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setFormVisible(true)}
            >
              添加仓库
            </Button>
          </div>
          
          <RepositoryList repositories={repositories} />
          
          <RepositoryForm
            open={formVisible}
            onCancel={() => setFormVisible(false)}
            onSubmit={handleAddRepository}
          />
        </div>
      </Content>
    </Layout>
  );
}