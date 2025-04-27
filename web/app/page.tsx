'use client';
import { useState } from 'react';
import { Button, Typography, Layout, Space, Input, Empty } from 'antd';
import { PlusOutlined, SearchOutlined, DatabaseOutlined } from '@ant-design/icons';
import RepositoryForm from './components/RepositoryForm';
import RepositoryList from './components/RepositoryList';
import { Repository, RepositoryFormValues } from './types';

const { Content, Header } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

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
  {
    id: '3',
    name: 'Ant Design',
    address: 'https://github.com/ant-design/ant-design',
    type: 'git',
    prompt: '分析Ant Design源码',
    model: 'gpt-4',
    openAIKey: '',
    openAIEndpoint: '',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'TypeScript',
    address: 'https://github.com/microsoft/TypeScript',
    type: 'git',
    prompt: '分析TypeScript源码',
    model: 'gpt-4',
    openAIKey: '',
    openAIEndpoint: '',
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z',
  },
];

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>(MOCK_REPOSITORIES);
  const [formVisible, setFormVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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

  const filteredRepositories = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchValue.toLowerCase()) || 
    repo.address.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DatabaseOutlined style={{ fontSize: 24, color: 'white', marginRight: 12 }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>Koala Wiki</Title>
        </div>
      </Header>
      <Content style={{ padding: '24px' }}>
        <div className="page-container">
          <div className="page-header">
            <Title level={2}>仓库列表</Title>
            <Space>
              <Search
                placeholder="搜索仓库名称或地址"
                allowClear
                onSearch={value => setSearchValue(value)}
                onChange={e => setSearchValue(e.target.value)}
                style={{ width: 300 }}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setFormVisible(true)}
              >
                添加仓库
              </Button>
            </Space>
          </div>
          
          {filteredRepositories.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                searchValue ? `没有找到与"${searchValue}"相关的仓库` : "暂无仓库数据"
              }
            >
              <Button type="primary" onClick={() => setFormVisible(true)}>
                立即添加
              </Button>
            </Empty>
          ) : (
            <RepositoryList repositories={filteredRepositories} />
          )}
          
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