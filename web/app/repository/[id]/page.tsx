'use client';
import { Card, Descriptions, Typography, Divider, Tag, Space, Button } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Repository } from '../../types';
import { 
  GithubOutlined, 
  BookOutlined, 
  RobotOutlined, 
  ClockCircleOutlined,
  KeyOutlined,
  ApiOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// 模拟数据，实际应用中应从API获取
const MOCK_REPOSITORIES: Repository[] = [
  {
    id: '1',
    name: 'React',
    address: 'https://github.com/facebook/react',
    type: 'git',
    prompt: '分析React源码，重点关注核心的渲染和调度算法，并详细解释Fiber架构的实现原理和运行机制。分析组件的生命周期方法和Hooks的实现方式，对比两种编写组件的优缺点。探讨React的事件系统实现和与DOM事件的关系。',
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
    prompt: '分析Next.js源码，重点关注其服务器端渲染(SSR)和静态站点生成(SSG)的实现机制。详细解释Next.js的路由系统和数据获取方法的工作原理。分析App Router和Pages Router的区别与实现。探讨Next.js的构建优化策略和中间件系统的设计。',
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
    return <Card loading style={{ width: '100%', borderRadius: 8 }} />;
  }

  if (!repository) {
    return (
      <Card bordered={false} className="doc-container">
        <Title level={4}>仓库不存在</Title>
        <Paragraph>
          <Text type="secondary">请检查仓库ID是否正确，或返回首页查看可用仓库。</Text>
        </Paragraph>
        <Button type="primary" href="/">返回首页</Button>
      </Card>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <Space direction="vertical" size={4}>
          <Title level={2} style={{ margin: 0 }}>{repository.name}</Title>
          <Text type="secondary">
            {repository.type.toUpperCase()} 仓库 · 
            最后更新: {new Date(repository.updatedAt).toLocaleString('zh-CN')}
          </Text>
        </Space>
        <Space>
          <Button type="primary" icon={<BookOutlined />} href={`/repository/${repository.id}/doc`}>
            浏览文档
          </Button>
        </Space>
      </div>
      
      <Card bordered={false} className="doc-container">
        <Descriptions 
          title={
            <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
              <GithubOutlined style={{ fontSize: 20, marginRight: 8 }} />
              <Text strong>仓库信息</Text>
            </div>
          }
          column={{ xs: 1, sm: 1, md: 2 }} 
          bordered={false}
          labelStyle={{ fontWeight: 500 }}
          contentStyle={{ maxWidth: '500px' }}
          size="middle"
        >
          <Descriptions.Item 
            label="仓库名称"
            labelStyle={{ color: 'rgba(0, 0, 0, 0.85)' }}
          >
            {repository.name}
          </Descriptions.Item>
          
          <Descriptions.Item 
            label="仓库类型"
            labelStyle={{ color: 'rgba(0, 0, 0, 0.85)' }}
          >
            <Tag color={repository.type === 'git' ? 'blue' : 'green'}>
              {repository.type.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label="仓库地址"
            labelStyle={{ color: 'rgba(0, 0, 0, 0.85)' }}
            span={2}
          >
            <a href={repository.address} target="_blank" rel="noopener noreferrer">
              {repository.address}
            </a>
          </Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <Descriptions 
          title={
            <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
              <RobotOutlined style={{ fontSize: 20, marginRight: 8 }} />
              <Text strong>AI分析配置</Text>
            </div>
          }
          column={{ xs: 1, sm: 1, md: 2 }} 
          bordered={false}
          labelStyle={{ fontWeight: 500 }}
          size="middle"
        >
          <Descriptions.Item 
            label="使用模型"
            labelStyle={{ color: 'rgba(0, 0, 0, 0.85)' }}
          >
            <Tag color="purple">{repository.model || '默认模型'}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label="OpenAI端点"
            labelStyle={{ color: 'rgba(0, 0, 0, 0.85)' }}
          >
            <Text>{repository.openAIEndpoint || '使用默认端点'}</Text>
          </Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 16px 0' }}>
            <BookOutlined style={{ fontSize: 20, marginRight: 8 }} />
            <Text strong>构建提示词</Text>
          </div>
          <Paragraph style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
            {repository.prompt}
          </Paragraph>
        </div>
        
        <Divider />
        
        <Descriptions size="small" column={2}>
          <Descriptions.Item 
            label={
              <Text type="secondary" style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} /> 创建时间
              </Text>
            }
          >
            <Text type="secondary" style={{ fontSize: '12px' }}>{new Date(repository.createdAt).toLocaleString('zh-CN')}</Text>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={
              <Text type="secondary" style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} /> 更新时间
              </Text>
            }
          >
            <Text type="secondary" style={{ fontSize: '12px' }}>{new Date(repository.updatedAt).toLocaleString('zh-CN')}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
} 