'use client';
import { Layout, Typography, Spin } from 'antd';
import { BookOutlined, FileOutlined, HomeFilled, FolderOutlined, FileTextOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { documentCatalog } from '../../services/warehouseService';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

// Define the DocumentCatalogResponse type here since it's missing from the import
interface DocumentCatalogResponse {
  key: string;
  label: string;
  url: string;
  order: number;
  children?: DocumentCatalogResponse[];
}

// 递归生成菜单项
const generateMenuItems = (
  data: DocumentCatalogResponse, 
  parentKey: string = '', 
  owner: string, 
  name: string
) => {
  const key = parentKey ? `${parentKey}-${data.key}` : data.key;
  const item = {
    key,
    icon: data.children?.length ? <FolderOutlined /> : <FileTextOutlined />,
    label: data.children?.length 
      ? data.label 
      : <Link href={`/${owner}/${name}/${data.url}`}>{data.label}</Link>,
  };

  if (data.children?.length) {
    return {
      ...item,
      children: data.children
        .sort((a, b) => a.order - b.order)
        .map(child => generateMenuItems(child, key, owner, name))
    };
  }

  return item;
};

export default function RepositoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { owner: string; name: string };
}) {
  const pathname = usePathname();
  
  // 从路由路径解析 owner 和 name
  const pathParts = pathname.split('/').filter(Boolean);
  const owner = pathParts[0] || '';
  const name = pathParts[1] || '';
  
  const [docItems, setDocItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  // 根据路径判断当前选中的菜单项
  const selectedKey = pathname.includes('/') ? 'docs' : 'overview';

  useEffect(() => {
    if (!owner || !name) return;
    
    const fetchDocumentCatalog = async () => {
      setLoading(true);
      try {
        const response = await documentCatalog(owner, name);
        setDocItems(response.data);
        // Set a mock last updated date - in production this would come from API
        setLastUpdated(`27 April 2025 (e96b16)`);
      } catch (error) {
        console.error('Failed to fetch document catalog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentCatalog();
  }, [owner, name, selectedKey]);

  const renderSidebarItem = (item: DocumentCatalogResponse, level = 0) => {
    const isActive = pathname.includes(`/${item.url}`);
    const style = {
      padding: '8px 24px',
      paddingLeft: `${24 + level * 16}px`,
      color: isActive ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.65)',
      cursor: 'pointer',
      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
      transition: 'all 0.3s',
      display: 'block',
      textDecoration: 'none',
      fontWeight: isActive ? 500 : 400,
      margin: '4px 0',
      borderRadius: '4px',
    };

    return (
      <div key={item.key}>
        {item.children?.length ? (
          <>
            <div style={style}>
              {item.label}
            </div>
            {item.children.sort((a, b) => a.order - b.order).map(child => 
              renderSidebarItem(child, level + 1)
            )}
          </>
        ) : (
          <Link 
            href={`/${owner}/${name}/${item.url}`}
            style={style}
          >
            {item.label}
          </Link>
        )}
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 24px', 
        background: '#222',
        position: 'fixed',
        width: '100%',
        zIndex: 1000 
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <HomeFilled style={{ fontSize: 24, color: 'white', marginRight: 16 }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>Koala Wiki</Title>
        </Link>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider 
          width={260} 
          style={{ 
            background: '#101010', 
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
          }}
        >
          <div style={{ padding: '16px 0' }}>
            <Text style={{ padding: '0 24px', color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: 12 }}>
              Last updated: {lastUpdated}
            </Text>
            
            <div style={{ marginTop: 16 }}>
              <Link 
                href={`/${owner}/${name}`}
                style={{ 
                  padding: '8px 24px', 
                  color: pathname === `/${owner}/${name}` ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.65)', 
                  backgroundColor: pathname === `/${owner}/${name}` ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  fontWeight: pathname === `/${owner}/${name}` ? 500 : 400,
                  display: 'block',
                  textDecoration: 'none',
                  margin: '4px 0',
                  borderRadius: '4px',
                }}
              >
                Overview
              </Link>
              
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <Spin size="small" />
                </div>
              ) : (
                docItems.map(item => renderSidebarItem(item))
              )}
            </div>
          </div>
        </Sider>
        <Content style={{ 
          marginLeft: 260, 
          padding: '24px', 
          background: '#f5f5f5', 
          minHeight: 'calc(100vh - 64px)'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
} 