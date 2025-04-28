'use client';
import { 
  Card, 
  Typography, 
  Tag, 
  Space, 
  Button, 
  Row, 
  Col, 
  Skeleton, 
  Statistic, 
  Avatar,
  Tabs,
  Tooltip,
  Progress,
  theme,
  Divider
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Repository } from '../../types';
import { 
  GithubOutlined, 
  BookOutlined, 
  RobotOutlined, 
  ClockCircleOutlined,
  KeyOutlined,
  ApiOutlined,
  InfoCircleOutlined,
  BranchesOutlined,
  TagOutlined,
  FileTextOutlined,
  CodeOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { getWarehouseOverview } from '../../services';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

// 获取仓库所有者和名称
const getRepoInfo = (address: string) => {
  try {
    if (address.includes('github.com')) {
      const parts = address.replace('https://github.com/', '').split('/');
      return {
        owner: parts[0],
        name: parts[1]?.split('.')[0] // 去掉可能的 .git 后缀
      };
    }

    // 解析 url
    const url = new URL(address);
    const pathParts = url.pathname.split('/');
    return {
      owner: pathParts[1],
      name: pathParts[2]?.split('.')[0] // 去掉可能的 .git 后缀
    };
  } catch (e) {
    // 解析失败，返回默认值
    return { owner: '', name: '' };
  }
};

// 根据地址获取头像
const getAvatarUrl = (repository: Repository) => {
  const repoInfo = getRepoInfo(repository.address);
  if (repository.address.includes('github.com') && repoInfo.owner) {
    return `https://github.com/${repoInfo.owner}.png`;
  }
  return null;
};

export default function RepositoryPage() {
  const params = useParams();
  const router = useRouter();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { token } = useToken();
  const [document,setDocument] = useState<any>({
    content:'',
    title:''
  })
  
  useEffect(() => {
    // 模拟API调用
    const fetchRepository = async () => {
      setLoading(true);
      try {
        // 使用 owner 和 name 参数来查找仓库
        // const repo = MOCK_REPOSITORIES.find(r => {
        //   const repoInfo = getRepoInfo(r.address);
        //   return repoInfo.owner === params.owner && repoInfo.name === params.name;
        // });
        const value = await getWarehouseOverview(params.owner.toString(),params.name.toString())
        console.log(value);
        setDocument(value.data);
        // setRepository(repo || null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRepository();
  }, [params.owner, params.name]);


  // 仓库状态配置
  const statusConfig = {
    0: { 
      color: 'orange', 
      text: '待处理', 
      icon: <ClockCircleOutlined />,
      progress: 0
    },
    1: { 
      color: 'processing', 
      text: '处理中', 
      icon: <SyncOutlined spin />,
      progress: 50
    },
    2: { 
      color: 'success', 
      text: '已完成', 
      icon: <CheckCircleOutlined />,
      progress: 100
    },
    3: { 
      color: 'default', 
      text: '已取消', 
      icon: <CloseCircleOutlined />,
      progress: 0
    },
    4: { 
      color: 'purple', 
      text: '未授权', 
      icon: <InfoCircleOutlined />,
      progress: 0
    },
    99: { 
      color: 'error', 
      text: '已失败', 
      icon: <CloseCircleOutlined />,
      progress: 0
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ padding: '24px 16px' }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Skeleton.Button active size="large" block style={{ height: 60 }} />
          </Col>
          <Col xs={24} md={16}>
            <Card>
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="page-container" style={{ padding: '24px 16px' }}>
        <Card
          className="error-container"
          styles={{
            body: {
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: 300,
              background: token.colorBgLayout
            }
          }}
        >
          <InfoCircleOutlined style={{ fontSize: 64, color: token.colorWarning, marginBottom: 24 }} />
          <Title level={3} style={{ margin: '0 0 16px 0' }}>仓库不存在</Title>
          <Paragraph>
            <Text type="secondary" style={{ fontSize: 16 }}>请检查仓库信息是否正确，或返回首页查看可用仓库。</Text>
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/')}
            style={{ marginTop: 24 }}
          >
            返回首页
          </Button>
        </Card>
      </div>
    );
  }

  const statusInfo = statusConfig[repository.status as keyof typeof statusConfig] || 
                   { color: 'default', text: '未知状态', icon: <InfoCircleOutlined />, progress: 0 };
  
  const avatarUrl = getAvatarUrl(repository);
  const isGitRepo = repository.type.toLowerCase() === 'git';
  
  // 选项卡
  const tabItems = [
    {
      key: 'overview',
      label: (
        <Space>
          <InfoCircleOutlined />
          <span>概览</span>
        </Space>
      ),
      children: (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card 
              title={
                <Space align="center">
                  <FileTextOutlined />
                  <span>仓库说明</span>
                </Space>
              }
              style={{ height: '100%' }}
            >
              {repository.description ? (
                <Paragraph style={{ fontSize: 16 }}>
                  {repository.description}
                </Paragraph>
              ) : (
                <Text type="secondary">暂无描述信息</Text>
              )}
              
              <div style={{ marginTop: 24 }}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div>
                    <Text strong style={{ marginRight: 8 }}>仓库地址:</Text>
                    <Typography.Link href={repository.address} target="_blank" ellipsis>
                      {repository.address}
                    </Typography.Link>
                  </div>
                  
                  <div>
                    <Text strong style={{ marginRight: 8 }}>分支:</Text>
                    <Space>
                      <BranchesOutlined style={{ color: token.colorPrimary }} />
                      <Text>{repository.branch}</Text>
                    </Space>
                  </div>
                  
                  {repository.version && (
                    <div>
                      <Text strong style={{ marginRight: 8 }}>版本:</Text>
                      <Space>
                        <TagOutlined style={{ color: token.colorSuccess }} />
                        <Text>{repository.version}</Text>
                      </Space>
                    </div>
                  )}
                </Space>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Space direction="vertical" style={{ width: '100%' }} size={24}>
              <Card 
                title={
                  <Space align="center">
                    <RobotOutlined />
                    <span>AI 模型</span>
                  </Space>
                }
              >
                <Statistic
                  value={repository.model || '默认模型'}
                  prefix={<CodeOutlined style={{ color: token.colorPrimary }} />}
                />
              </Card>
              
              <Card 
                title={
                  <Space align="center">
                    <ClockCircleOutlined />
                    <span>处理状态</span>
                  </Space>
                }
              >
                <div style={{ textAlign: 'center' }}>
                  <Progress 
                    type="dashboard" 
                    percent={statusInfo.progress} 
                    status={statusInfo.color as any}
                    format={() => <div style={{ fontSize: 20, color: token.colorText }}>{statusInfo.icon}</div>}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Tag color={statusInfo.color} style={{ padding: '4px 8px', fontSize: 14 }}>
                      {statusInfo.text}
                    </Tag>
                  </div>
                </div>
              </Card>
            </Space>
          </Col>
          
          <Col span={24}>
            <Card 
              title={
                <Space align="center">
                  <RobotOutlined />
                  <span>分析提示词</span>
                </Space>
              }
            >
              <div style={{ 
                background: token.colorFillTertiary,
                padding: 24,
                borderRadius: 8,
                border: `1px solid ${token.colorBorderSecondary}`
              }}>
                <Typography.Paragraph style={{ margin: 0, fontSize: 15, lineHeight: 1.8 }}>
                  {repository.prompt}
                </Typography.Paragraph>
              </div>
            </Card>
          </Col>
        </Row>
      )
    },
    {
      key: 'settings',
      label: (
        <Space>
          <SettingOutlined />
          <span>设置</span>
        </Space>
      ),
      children: (
        <Card >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title level={5}>API 配置</Title>
              
              <div style={{ 
                background: token.colorFillTertiary,
                padding: 24,
                borderRadius: 8,
                marginTop: 16
              }}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div>
                    <Text strong>
                      <KeyOutlined style={{ marginRight: 8 }} />
                      API 密钥:
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      {repository.openAIKey ? (
                        <Typography.Text copyable={{ text: repository.openAIKey }}>
                          {repository.openAIKey.substring(0, 3)}...{repository.openAIKey.substring(repository.openAIKey.length - 4)}
                        </Typography.Text>
                      ) : (
                        <Text type="secondary">未设置 API 密钥</Text>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Text strong>
                      <ApiOutlined style={{ marginRight: 8 }} />
                      API 端点:
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      {repository.openAIEndpoint ? (
                        <Typography.Text ellipsis copyable={{ text: repository.openAIEndpoint }}>
                          {repository.openAIEndpoint}
                        </Typography.Text>
                      ) : (
                        <Text type="secondary">使用默认 API 端点</Text>
                      )}
                    </div>
                  </div>
                </Space>
              </div>
            </Col>
            
            <Col span={24}>
              <Title level={5}>时间信息</Title>
              
              <Row gutter={24} style={{ marginTop: 16 }}>
                <Col xs={24} sm={12}>
                  <Statistic 
                    title="创建时间" 
                    value={new Date(repository.createdAt).toLocaleString('zh-CN')}
                    prefix={<ClockCircleOutlined />} 
                  />
                </Col>
                
                <Col xs={24} sm={12}>
                  <Statistic 
                    title="更新时间" 
                    value={new Date(repository.updatedAt || repository.createdAt).toLocaleString('zh-CN')}
                    prefix={<ClockCircleOutlined />} 
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      )
    }
  ];

  // Git 仓库的特殊布局
  const GitRepoHeader = () => (
    <div className="github-header" style={{
      padding: '24px 0',
      marginBottom: 24,
      borderRadius: 8,
      background: token.colorFillTertiary,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '30%',
        height: '100%',
        background: `linear-gradient(45deg, ${token.colorPrimaryBg} 0%, transparent 100%)`,
        opacity: 0.5,
        zIndex: 0
      }} />
      
      <Row gutter={24} style={{ position: 'relative', zIndex: 1 }}>
        <Col xs={24} md={16} style={{ padding: '0 32px' }}>
          <Space align="start" size={20}>
            <Avatar 
              size={64} 
              src={avatarUrl} 
              icon={!avatarUrl ? <GithubOutlined /> : undefined}
              style={{ 
                backgroundColor: !avatarUrl ? token.colorPrimary : undefined,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            <div>
              <Space align="center" style={{ marginBottom: 8 }}>
                <Title level={2} style={{ margin: 0 }}>{repository.name}</Title>
                <Tag color="blue" style={{ marginLeft: 8, fontSize: 14 }}>
                  <GithubOutlined style={{ marginRight: 4 }} />
                  {repository.type.toUpperCase()}
                </Tag>
              </Space>
              
              <Paragraph style={{ 
                color: token.colorTextSecondary,
                fontSize: 15,
                marginBottom: 16
              }}>
                {repository.description || '无描述信息'}
              </Paragraph>
              
              <Space wrap size={16}>
                <Space>
                  <BranchesOutlined />
                  <Text strong>{repository.branch}</Text>
                </Space>
                
                {repository.version && (
                  <Space>
                    <TagOutlined />
                    <Text strong>{repository.version}</Text>
                  </Space>
                )}
                
                <Tag color={statusInfo.color}>
                  {statusInfo.icon} {statusInfo.text}
                </Tag>
              </Space>
            </div>
          </Space>
        </Col>
        
        <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 32px' }}>
          <Space size={16}>
            <Tooltip title="浏览文档">
              <Button 
                type="primary" 
                icon={<BookOutlined />} 
                size="large"
                href={`/${params.owner}/${params.name}/doc`}
              >
                浏览文档
              </Button>
            </Tooltip>
            
            <Tooltip title="访问源仓库">
              <Button 
                icon={<GithubOutlined />}
                size="large"
                href={repository.address}
                target="_blank"
              >
                查看源码
              </Button>
            </Tooltip>
          </Space>
        </Col>
      </Row>
    </div>
  );

  // 非Git仓库的标准布局
  const StandardHeader = () => (
    <div className="standard-header">
      <Space direction="vertical" size={16} style={{ width: '100%', marginBottom: 24 }}>
        <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space align="center">
            <Avatar 
              size={48} 
              icon={<FileTextOutlined />}
              style={{ 
                backgroundColor: token.colorInfo,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Title level={2} style={{ margin: 0 }}>{repository.name}</Title>
            <Tag color="green">
              <FileTextOutlined style={{ marginRight: 4 }} />
              {repository.type.toUpperCase()}
            </Tag>
          </Space>
          
          <Button 
            type="primary" 
            icon={<BookOutlined />} 
            size="large"
            href={`/${params.owner}/${params.name}/doc`}
          >
            浏览文档
          </Button>
        </Space>
        
        <div style={{ 
          padding: '12px 16px', 
          background: token.colorFillQuaternary,
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Space>
            <Tag color={statusInfo.color}>
              {statusInfo.icon} {statusInfo.text}
            </Tag>
            <Text type="secondary">
              最后更新: {new Date(repository.updatedAt || repository.createdAt).toLocaleString('zh-CN')}
            </Text>
          </Space>

          <Space>
            <BranchesOutlined />
            <Text>{repository.branch}</Text>
            {repository.version && (
              <>
                <Divider type="vertical" />
                <TagOutlined />
                <Text>{repository.version}</Text>
              </>
            )}
          </Space>
        </div>
      </Space>
    </div>
  );

  return (
    <div className="page-container" style={{ 
      padding: '24px 16px',
      maxWidth: 1200,
      margin: '0 auto'
    }}>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/')}
        >
          返回列表
        </Button>
      </div>
      
      {isGitRepo ? <GitRepoHeader /> : <StandardHeader />}
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        tabBarStyle={{ marginBottom: 24 }}
      />
    </div>
  );
} 