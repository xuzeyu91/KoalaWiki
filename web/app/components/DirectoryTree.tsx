import { Card, Tree, Typography } from 'antd';
import { DataNode } from 'antd/es/tree';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const { DirectoryTree } = Tree;

interface DirectoryTreeProps {
  treeData: DataNode[];
  repositoryId: string;
  currentPath?: string;
}

const DocDirectoryTree: React.FC<DirectoryTreeProps> = ({
  treeData,
  repositoryId,
  currentPath
}) => {
  const router = useRouter();

  const handleSelect = (_, info) => {
    const selectedNode = info.node;
    if (!selectedNode.children) {
      const path = selectedNode.key;
      router.push(`/repository/${repositoryId}/doc/${path}`);
    }
  };

  return (
    <Card
      title={<Title level={5}>文档目录</Title>}
      style={{ height: '100%' }}
      bodyStyle={{ overflow: 'auto', maxHeight: 'calc(100vh - 120px)' }}
    >
      <DirectoryTree
        defaultExpandAll
        onSelect={handleSelect}
        treeData={treeData}
        selectedKeys={currentPath ? [currentPath] : []}
      />
    </Card>
  );
};

export default DocDirectoryTree; 