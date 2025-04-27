'use client';
import { Alert, Card, Skeleton, Typography, Empty, Button, Space } from 'antd';
import { useParams } from 'next/navigation';
import { BookOutlined, InfoCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;

export default function DocumentDefaultPage() {
  const params = useParams();
  const { owner, name } = params;

  return (
    <Card bordered={false} className="doc-container">
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <BookOutlined style={{ fontSize: 64, color: 'var(--ant-color-primary)' }} />
          
          <Title level={2}>文档浏览</Title>
          
          <Paragraph style={{ maxWidth: 600, margin: '0 auto' }}>
            这里展示了通过AI对仓库代码的分析结果，提供代码结构、核心功能和实现原理的深度解析。
          </Paragraph>
          
          <Alert
            message="选择文档开始浏览"
            description={
              <div style={{ textAlign: 'left' }}>
                <Paragraph>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  请从左侧目录选择一个文档进行查看，目录结构反映了代码的组织方式。
                </Paragraph>
                <Paragraph>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  每个文档都由AI根据代码自动生成，并提供了代码的关键洞察。
                </Paragraph>
              </div>
            }
            type="info"
            showIcon={false}
            style={{ maxWidth: 600, margin: '0 auto', textAlign: 'left' }}
          />
          
          <div>
            <Link href={`/${owner}/${name}`}>
              <Button type="default" icon={<ArrowRightOutlined />}>
                返回仓库概览
              </Button>
            </Link>
          </div>
        </Space>
      </div>
    </Card>
  );
} 