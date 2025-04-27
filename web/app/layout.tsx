import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './globals.css';
import OpenAIProvider from './context/OpenAIContext';

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
              <OpenAIProvider>
                {children}
              </OpenAIProvider>
            </ConfigProvider>
          </AntdRegistry>
        </body>
      </html>
    )
  }