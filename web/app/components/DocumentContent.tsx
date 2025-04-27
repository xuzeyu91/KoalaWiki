import { Card, Skeleton, Typography } from 'antd';
import ReactMarkdown from 'react-markdown';

const { Title } = Typography;

interface DocumentContentProps {
  title: string;
  content: string;
  loading?: boolean;
}

const DocumentContent: React.FC<DocumentContentProps> = ({
  title,
  content,
  loading = false
}) => {
  return (
    <Card style={{ minHeight: '100%' }}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 15 }} />
      ) : (
        <>
          <Title level={2}>{title}</Title>
          <div className="markdown-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </>
      )}
    </Card>
  );
};

export default DocumentContent; 