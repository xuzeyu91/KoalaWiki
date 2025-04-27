import { Card, Typography } from 'antd';
import { Repository } from '../types';
import Link from 'next/link';

const { Text, Title } = Typography;

interface RepositoryCardProps {
  repository: Repository;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => {
  return (
    <Link href={`/repository/${repository.id}`}>
      <Card 
        hoverable
        title={
          <Title level={4} ellipsis={{ tooltip: repository.name }}>
            {repository.name}
          </Title>
        }
        style={{ height: '100%' }}
      >
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary">仓库地址：</Text>
          <Text ellipsis={{ tooltip: repository.address }}>
            {repository.address}
          </Text>
        </div>
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary">仓库类型：</Text>
          <Text>{repository.type}</Text>
        </div>
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary">使用模型：</Text>
          <Text>{repository.model || '默认'}</Text>
        </div>
        <div>
          <Text type="secondary">更新时间：</Text>
          <Text>{new Date(repository.updatedAt).toLocaleString('zh-CN')}</Text>
        </div>
      </Card>
    </Link>
  );
};

export default RepositoryCard; 