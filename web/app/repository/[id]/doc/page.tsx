'use client';
import { Alert, Card, Skeleton, Typography } from 'antd';
import { useParams } from 'next/navigation';

const { Title, Text } = Typography;

export default function DocumentDefaultPage() {
  const params = useParams();
  const repositoryId = params.id as string;

  return (
    <Card>
      <Title level={3}>文档浏览</Title>
      <Alert
        message="请从左侧目录选择一个文档进行查看"
        description={
          <div>
            <Text>当前仓库ID: {repositoryId}</Text>
            <br />
            <Text>左侧目录树显示了该仓库的所有文档，点击任意文档进行查看。</Text>
          </div>
        }
        type="info"
        showIcon
      />
    </Card>
  );
} 