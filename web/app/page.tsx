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
const { Title,  Paragraph } = Typography;
const { Search } = Input;

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
      }
    } catch (error) {
      console.error('获取仓库列表出错:', error);
      message.error('获取仓库列表出错，请稍后重试');
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
                href="https://github.com/AIDotNet/koalawiki" 
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
              <Card  style={{ borderRadius: 12, marginBottom: 24 }}>
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
                  <Card loading className="repository-card" />
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