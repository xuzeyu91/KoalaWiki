import { Card, Tag, Typography } from 'antd';
import { Repository } from '../types';
import Link from 'next/link';
import { FileOutlined, ClockCircleOutlined, CodeOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface RepositoryCardProps {
  repository: Repository;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => {
  return (
    <Link href={`/repository/${repository.id}`}>
      <Card 
        hoverable
        className="repository-card"
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FileOutlined style={{ marginRight: 8, color: 'var(--ant-color-primary)' }} />
            <Title level={4} ellipsis={{ tooltip: repository.name }} style={{ margin: 0 }}>
              {repository.name}
            </Title>
          </div>
        }
        extra={<Tag color={repository.type === 'git' ? 'blue' : 'green'}>{repository.type.toUpperCase()}</Tag>}
      >
        <div style={{ marginBottom: 16 }}>
          <Text ellipsis={{ tooltip: repository.address }} style={{ display: 'block' }}>
            {repository.address}
          </Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text type="secondary" style={{ display: 'flex', alignItems: 'center' }}>
              <CodeOutlined style={{ marginRight: 4 }} />
              {repository.model || '默认模型'}
            </Text>
          </div>
          <div>
            <Text type="secondary" style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {new Date(repository.updatedAt).toLocaleString('zh-CN')}
            </Text>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default RepositoryCard; 