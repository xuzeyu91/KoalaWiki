'use client';
import { Col, Row } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DocDirectoryTree from '../../../components/DirectoryTree';
import { DataNode } from 'antd/es/tree';

export default function DocumentLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loading, setLoading] = useState(true);
  const { owner, name } = params;
  const documentPath = Array.isArray(params.path) ? params.path.join('/') : params.path;

  return (
    <Row gutter={24}>
      
      <Col xs={24} sm={24} md={18} lg={19} xl={20}>
        {children}
      </Col>
    </Row>
  );
} 