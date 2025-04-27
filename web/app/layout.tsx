import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './globals.css';

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="zh-CN">
        <body>
          <AntdRegistry>
            <ConfigProvider
              locale={zhCN}
              theme={{
                token: {
                  colorPrimary: '#1677ff',
                },
                algorithm: theme.defaultAlgorithm,
              }}
            >
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </body>
      </html>
    )
  }