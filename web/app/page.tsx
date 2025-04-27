'use client';
import { useState, useEffect } from 'react';
import { Button, Typography, Layout, Space, Input, Empty, Card, Row, Col, Statistic, Tooltip, Avatar, message, Pagination } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  DatabaseOutlined, 
  ApiOutlined,
  GithubOutlined,
  CodeOutlined,
  RobotOutlined,
  FileTextOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import RepositoryForm from './components/RepositoryForm';
import RepositoryList from './components/RepositoryList';
import { Repository, RepositoryFormValues } from './types';
import { getWarehouse, submitWarehouse, WarehouseListResponse } from './services/warehouseService';

const { Content, Header } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// 模拟数据，实际应用中应从API获取
const MOCK_REPOSITORIES: Repository[] = [
  {
    id: '1',
    name: 'React',
    description: 'A JavaScript library for building user interfaces',
    address: 'https://github.com/facebook/react',
    type: 'git',
    branch: 'main',
    status: 2,
    version: '18.0.0',
    prompt: '分析React源码，重点关注核心的渲染和调度算法，并详细解释Fiber架构的实现原理和运行机制。分析组件的生命周期方法和Hooks的实现方式，对比两种编写组件的优缺点。',
    model: 'gpt-4',
    openAIKey: '',
    openAIEndpoint: '',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Next.js',
    description: 'The React Framework for the Web',
    address: 'https://github.com/vercel/next.js',
    type: 'git',
    branch: 'main',
    status: 1,
    version: '13.0.0',
    prompt: '分析Next.js源码，重点关注其服务器端渲染(SSR)和静态站点生成(SSG)的实现机制。详细解释Next.js的路由系统和数据获取方法的工作原理。',
    model: 'gpt-4',
    openAIKey: '',
    openAIEndpoint: '',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Ant Design',
    description: 'An enterprise-class UI design language and React UI library',
    address: 'https://github.com/ant-design/ant-design',
    type: 'git',
    branch: 'master',
    status: 0,
    version: '5.0.0',
    prompt: '分析Ant Design源码，重点关注组件系统的设计和实现，以及主题定制功能的实现原理。详细解释关键组件如Table、Form的工作机制。',
    model: 'gpt-4',
    openAIKey: '',
    openAIEndpoint: '',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'TypeScript',
    description: 'JavaScript with syntax for types',
    address: 'https://github.com/microsoft/TypeScript',
    type: 'git',
    branch: 'main',
    status: 99,
    version: '5.0.0',
    prompt: '分析TypeScript源码，重点关注类型系统的实现原理和类型检查器的工作机制。详细解释TypeScript编译器的架构设计和代码生成策略。',
    model: 'gpt-4',
    openAIKey: '',
    openAIEndpoint: '',
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z',
  },
];

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // 加载仓库数据
  useEffect(() => {
    fetchRepositories();
  }, [currentPage, pageSize]);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const response = await getWarehouse(currentPage, pageSize);
      if (response.success && response.data) {
        setRepositories(response.data.items);
        setTotal(response.data.total);
      } else {
        message.error('获取仓库列表失败: ' + (response.error || '未知错误'));
        // 回退到模拟数据以防API调用失败
        setRepositories(MOCK_REPOSITORIES);
      }
    } catch (error) {
      console.error('获取仓库列表出错:', error);
      message.error('获取仓库列表出错，请稍后重试');
      // 回退到模拟数据以防API调用失败
      setRepositories(MOCK_REPOSITORIES);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRepository = async (values: RepositoryFormValues) => {
    try {
      const response = await submitWarehouse(values);
      if (response.success) {
        message.success('仓库添加成功');
        fetchRepositories(); // 重新加载仓库列表
      } else {
        message.error('添加仓库失败: ' + (response.error || '未知错误'));
      }
    } catch (error) {
      console.error('添加仓库出错:', error);
      message.error('添加仓库出错，请稍后重试');
    }
    setFormVisible(false);
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const filteredRepositories = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchValue.toLowerCase()) || 
    repo.address.toLowerCase().includes(searchValue.toLowerCase())
  );

  // 计算统计数据
  const stats = {
    totalRepositories: total || repositories.length,
    gitRepos: repositories.filter(repo => repo.type === 'git').length,
    lastUpdated: repositories.length ? new Date(
      Math.max(...repositories.map(repo => new Date(repo.createdAt).getTime()))
    ).toLocaleDateString('zh-CN') : '-'
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="home-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div className="home-title" style={{ display: 'flex', alignItems: 'center' }}>
            <DatabaseOutlined style={{ fontSize: 28, color: 'white', marginRight: 12 }} />
            <Title level={3} style={{ color: 'white', margin: 0 }}>Koala Wiki</Title>
          </div>
          
          <Space>
            <Tooltip title="源码地址">
              <Button 
                type="text" 
                icon={<GithubOutlined />} 
                style={{ color: 'white' }} 
                href="https://github.com/yourusername/koalawiki" 
                target="_blank"
              />
            </Tooltip>
            <Tooltip title="API文档">
              <Button 
                type="text" 
                icon={<ApiOutlined />} 
                style={{ color: 'white' }} 
              />
            </Tooltip>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div className="page-container">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
                <Row gutter={24} align="middle">
                  <Col xs={24} md={16}>
                    <div style={{ paddingRight: 24 }}>
                      <Title level={2} className="welcome-title">AI驱动的代码知识库</Title>
                      <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
                        Koala Wiki 使用先进的AI技术分析您的代码仓库，生成详细的文档和见解，帮助您更深入地理解代码结构和工作原理。
                      </Paragraph>
                      <Button 
                        type="primary" 
                        size="large" 
                        icon={<PlusOutlined />} 
                        onClick={() => setFormVisible(true)}
                        className="add-button"
                      >
                        添加新仓库
                      </Button>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Statistic 
                          title="仓库总数" 
                          value={stats.totalRepositories} 
                          prefix={<DatabaseOutlined />} 
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic 
                          title="Git仓库" 
                          value={stats.gitRepos} 
                          prefix={<GithubOutlined />} 
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic 
                          title="最后更新" 
                          value={stats.lastUpdated} 
                          prefix={<FileTextOutlined />} 
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <div className="page-header">
            <Title level={3}>仓库列表</Title>
            <Space>
              <Search
                placeholder="搜索仓库名称或地址"
                allowClear
                onSearch={value => setSearchValue(value)}
                onChange={e => setSearchValue(e.target.value)}
                style={{ width: 300 }}
                className="search-box"
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setFormVisible(true)}
                className="add-button"
              >
                添加仓库
              </Button>
            </Space>
          </div>
          
          {loading ? (
            <Row gutter={[16, 16]} className="repository-grid">
              {[1, 2, 3, 4].map(i => (
                <Col xs={24} sm={12} md={8} lg={6} key={i}>
                  <Card loading bordered={false} className="repository-card" />
                </Col>
              ))}
            </Row>
          ) : filteredRepositories.length === 0 ? (
            <div className="empty-container">
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
            </div>
          ) : (
            <>
              <RepositoryList repositories={filteredRepositories} />
              {!searchValue && total > pageSize && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <Pagination 
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `共 ${total} 个仓库`}
                  />
                </div>
              )}
            </>
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