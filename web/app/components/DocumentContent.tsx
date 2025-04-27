import { Card, Skeleton, Typography, Space, Tag, Divider } from 'antd';
import ReactMarkdown from 'react-markdown';
import { FileTextOutlined, FieldTimeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface DocumentContentProps {
  title: string;
  content: string;
  loading?: boolean;
  lastUpdated?: string;
}

const DocumentContent: React.FC<DocumentContentProps> = ({
  title,
  content,
  loading = false,
  lastUpdated
}) => {
  return (
    <Card 
      className="doc-container"
      bordered={false}
      bodyStyle={{ padding: '16px 24px' }}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 15 }} />
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between',
            marginBottom: 16 
          }}>
            <Space direction="vertical" size={4} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FileTextOutlined style={{ 
                  fontSize: 20, 
                  marginRight: 8, 
                  color: 'var(--ant-color-primary)' 
                }} />
                <Title level={2} style={{ margin: 0 }}>{title}</Title>
              </div>
              
              {lastUpdated && (
                <Text type="secondary" style={{ marginLeft: 28, display: 'flex', alignItems: 'center' }}>
                  <FieldTimeOutlined style={{ marginRight: 4 }} /> 
                  最后更新: {new Date(lastUpdated).toLocaleString('zh-CN')}
                </Text>
              )}
            </Space>
            
            <Space>
              <Tag color="blue">文档</Tag>
            </Space>
          </div>
          
          <Divider style={{ marginTop: 0 }} />
          
          <div className="markdown-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </>
      )}
    </Card>
  );
};

export default DocumentContent; 