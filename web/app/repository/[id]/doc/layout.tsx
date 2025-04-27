'use client';
import { Col, Row } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DocDirectoryTree from '../../../components/DirectoryTree';
import { DataNode } from 'antd/es/tree';

// 模拟文档树数据，实际应用中应从API获取
const MOCK_TREE_DATA: DataNode[] = [
  {
    title: '文档',
    key: 'docs',
    children: [
      {
        title: '介绍',
        key: 'introduction',
        isLeaf: true,
      },
      {
        title: '架构',
        key: 'architecture',
        children: [
          {
            title: '核心组件',
            key: 'core-components',
            isLeaf: true,
          },
          {
            title: '数据流',
            key: 'data-flow',
            isLeaf: true,
          },
        ],
      },
      {
        title: '源码分析',
        key: 'source-code',
        children: [
          {
            title: '主要模块',
            key: 'main-modules',
            isLeaf: true,
          },
        ],
      },
    ],
  },
];

export default function DocumentLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loading, setLoading] = useState(true);
  const repositoryId = params.id as string;
  const documentPath = Array.isArray(params.path) ? params.path.join('/') : params.path;

  useEffect(() => {
    // 模拟API调用
    const fetchDirectoryTree = () => {
      setLoading(true);
      try {
        // 实际应用中，应该根据repositoryId调用API获取对应仓库的文档树
        setTreeData(MOCK_TREE_DATA);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDirectoryTree();
  }, [repositoryId]);

  return (
    <Row gutter={24}>
      <Col xs={24} sm={24} md={6} lg={5} xl={4}>
        <DocDirectoryTree
          treeData={treeData}
          repositoryId={repositoryId}
          currentPath={documentPath}
        />
      </Col>
      <Col xs={24} sm={24} md={18} lg={19} xl={20}>
        {children}
      </Col>
    </Row>
  );
} 