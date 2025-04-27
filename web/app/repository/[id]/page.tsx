'use client';
import { Card, Descriptions, Typography } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Repository } from '../../types';

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

export default function RepositoryPage() {
  const params = useParams();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟API调用
    const fetchRepository = () => {
      setLoading(true);
      try {
        const repo = MOCK_REPOSITORIES.find(r => r.id === params.id);
        setRepository(repo || null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRepository();
  }, [params.id]);

  if (loading) {
    return <Card loading style={{ width: '100%' }} />;
  }

  if (!repository) {
    return <Title level={4}>仓库不存在</Title>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Title level={2}>{repository.name} 仓库概览</Title>
      <Card>
        <Descriptions column={1} layout="vertical" bordered>
          <Descriptions.Item label="仓库名称">{repository.name}</Descriptions.Item>
          <Descriptions.Item label="仓库地址">{repository.address}</Descriptions.Item>
          <Descriptions.Item label="仓库类型">{repository.type}</Descriptions.Item>
          <Descriptions.Item label="构建提示词">{repository.prompt}</Descriptions.Item>
          <Descriptions.Item label="使用模型">{repository.model || '默认'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(repository.createdAt).toLocaleString('zh-CN')}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {new Date(repository.updatedAt).toLocaleString('zh-CN')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
} 