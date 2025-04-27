'use client';
import { Col, Row } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DocumentContent from '../../../../components/DocumentContent';
import DocumentToc from '../../../../components/DocumentToc';
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';

// 模拟文档数据，实际应用中应从API获取
const MOCK_DOCUMENTS = {
  'introduction': {
    title: '介绍',
    content: `# 介绍\n\n这是一个示例介绍文档。\n\n## 背景\n\n这个项目旨在提供代码分析功能。\n\n## 目的\n\n通过AI分析代码库，提供洞察。\n\n## 功能特点\n\n- 支持多种仓库类型\n- 自动生成文档\n- 提供详细的代码分析`,
    toc: [
      { key: 'introduction', href: '#介绍', title: '介绍' },
      { key: 'background', href: '#背景', title: '背景' },
      { key: 'purpose', href: '#目的', title: '目的' },
      { key: 'features', href: '#功能特点', title: '功能特点' },
    ],
    lastUpdated: '2023-05-15T10:30:00Z',
  },
  'core-components': {
    title: '核心组件',
    content: `# 核心组件\n\n本文档描述系统的核心组件。\n\n## 分析引擎\n\n负责处理代码并生成文档。\n\n## 文档生成器\n\n将分析结果转换为可读的文档。\n\n## API接口\n\n提供与系统交互的接口。`,
    toc: [
      { key: 'core-components', href: '#核心组件', title: '核心组件' },
      { key: 'analysis-engine', href: '#分析引擎', title: '分析引擎' },
      { key: 'doc-generator', href: '#文档生成器', title: '文档生成器' },
      { key: 'api', href: '#api接口', title: 'API接口' },
    ],
    lastUpdated: '2023-05-16T14:20:00Z',
  },
  'data-flow': {
    title: '数据流',
    content: `# 数据流\n\n本文档描述系统中的数据流。\n\n## 输入处理\n\n系统如何处理输入的代码库。\n\n## 数据转换\n\n如何分析和转换代码数据。\n\n## 输出生成\n\n如何生成最终的文档输出。`,
    toc: [
      { key: 'data-flow', href: '#数据流', title: '数据流' },
      { key: 'input', href: '#输入处理', title: '输入处理' },
      { key: 'transformation', href: '#数据转换', title: '数据转换' },
      { key: 'output', href: '#输出生成', title: '输出生成' },
    ],
    lastUpdated: '2023-05-17T09:15:00Z',
  },
  'main-modules': {
    title: '主要模块',
    content: `# 主要模块\n\n本文档描述系统的主要模块。\n\n## 仓库管理\n\n负责处理仓库的添加和维护。\n\n## 用户界面\n\n提供用户交互的界面。\n\n## 分析服务\n\n执行代码分析的核心服务。`,
    toc: [
      { key: 'main-modules', href: '#主要模块', title: '主要模块' },
      { key: 'repo-management', href: '#仓库管理', title: '仓库管理' },
      { key: 'ui', href: '#用户界面', title: '用户界面' },
      { key: 'analysis-service', href: '#分析服务', title: '分析服务' },
    ],
    lastUpdated: '2023-05-18T11:45:00Z',
  },
};

export default function DocumentPage() {
  const params = useParams();
  const [document, setDocument] = useState<{
    title: string;
    content: string;
    toc: AnchorLinkItemProps[];
    lastUpdated?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const path = Array.isArray(params.path) ? params.path : [params.path];
  const documentId = path[path.length - 1];

  useEffect(() => {
    // 模拟API调用
    const fetchDocument = () => {
      setLoading(true);
      try {
        // 实际应用中，应该根据repositoryId和documentId调用API获取文档内容
        const doc = MOCK_DOCUMENTS[documentId];
        setDocument(doc || null);
      } finally {
        setTimeout(() => setLoading(false), 500); // 添加延迟以模拟加载效果
      }
    };
    
    fetchDocument();
  }, [documentId]);

  return (
    <Row gutter={16}>
      <Col xs={24} md={18}>
        <DocumentContent
          title={document?.title || ''}
          content={document?.content || ''}
          loading={loading}
          lastUpdated={document?.lastUpdated}
        />
      </Col>
      <Col xs={0} md={6}>
        <DocumentToc toc={document?.toc || []} />
      </Col>
    </Row>
  );
} 