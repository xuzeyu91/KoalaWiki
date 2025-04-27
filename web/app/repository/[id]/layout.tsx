'use client';
import { Layout, Menu, Typography } from 'antd';
import { BookOutlined, FileOutlined, HomeFilled } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export default function RepositoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const pathname = usePathname();
  const { id } = params;

  // 根据路径判断当前选中的菜单项
  const selectedKey = pathname.includes('/doc') ? 'docs' : 'overview';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <HomeFilled style={{ fontSize: 24, color: 'white', marginRight: 16 }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>Koala Wiki</Title>
        </Link>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: 'white' }}>
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
            selectedKeys={[selectedKey]}
            items={[
              {
                key: 'overview',
                icon: <FileOutlined />,
                label: <Link href={`/repository/${id}`}>仓库概览</Link>,
              },
              {
                key: 'docs',
                icon: <BookOutlined />,
                label: <Link href={`/repository/${id}/doc`}>文档浏览</Link>,
              },
            ]}
          />
        </Sider>
        <Content style={{ padding: '24px', background: '#f5f5f5', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
} 