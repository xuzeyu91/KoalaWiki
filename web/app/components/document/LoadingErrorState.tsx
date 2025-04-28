import React from 'react';
import { Card, Skeleton, Typography, Button, Space, Empty, Result } from 'antd';
import { ArrowLeftOutlined, FileExclamationOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;

interface LoadingErrorStateProps {
  loading: boolean;
  error: string | null;
  owner: string;
  name: string;
  token: any;
}

// 自定义空状态组件
const EmptyDocumentState = ({ message, token, owner, name }) => (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    imageStyle={{ height: 80, opacity: 0.8 }}
    description={
      <Space direction="vertical" size="small" style={{ textAlign: 'center' }}>
        <Text style={{ fontSize: 16, color: token.colorTextSecondary }}>{message}</Text>
        <Paragraph type="secondary" style={{ fontSize: 14 }}>
          这可能是因为文档不存在或您没有访问权限
        </Paragraph>
      </Space>
    }
  >
    <Space>
      <Link href={`/${owner}/${name}`}>
        <Button type="primary" icon={<ArrowLeftOutlined />}>
          返回仓库概览
        </Button>
      </Link>
      <Link href={`/${owner}/${name}/search`}>
        <Button icon={<SearchOutlined />}>
          搜索文档
        </Button>
      </Link>
    </Space>
  </Empty>
);

const LoadingErrorState: React.FC<LoadingErrorStateProps> = ({
  loading,
  error,
  owner,
  name,
  token
}) => {
  // 加载状态显示骨架屏
  if (loading) {
    return (
      <Card style={{ 
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary
      }}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  // 根据错误类型显示不同的错误信息
  if (error) {
    if (error.includes('不存在') || error.includes('路径')) {
      return (
        <Card 
          style={{
            borderRadius: token.borderRadiusLG,
            overflow: 'hidden',
            boxShadow: token.boxShadowTertiary,
            padding: token.paddingLG
          }}
        >
          <EmptyDocumentState 
            message="未找到您请求的文档" 
            token={token}
            owner={owner}
            name={name}
          />
        </Card>
      );
    }

    return (
      <Card 
        style={{ 
          borderRadius: token.borderRadiusLG,
          overflow: 'hidden',
          boxShadow: token.boxShadowTertiary
        }}
      >
        <Result
          status="warning"
          icon={<FileExclamationOutlined style={{ color: token.colorWarning }} />}
          title={<Typography.Title level={3} style={{ color: token.colorTextHeading }}>无法加载文档内容</Typography.Title>}
          subTitle={<Text type="secondary">{error}</Text>}
          extra={[
            <Link key="back" href={`/${owner}/${name}`}>
              <Button 
                type="primary" 
                icon={<ArrowLeftOutlined />}
                style={{ marginRight: token.marginSM }}
              >
                返回仓库概览
              </Button>
            </Link>,
            <Button 
              key="retry" 
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
            >
              重新加载
            </Button>
          ]}
        />
      </Card>
    );
  }

  return null;
};

export default LoadingErrorState; 