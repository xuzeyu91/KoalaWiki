import React from 'react';

interface DocumentStylesProps {
  token: any;
}

const DocumentStyles: React.FC<DocumentStylesProps> = ({ token }) => {
  return (
    <style jsx global>{`
      /* 移动端抽屉样式 */
      .mobile-toc-drawer.visible {
        transform: translateX(0);
        opacity: 1;
        visibility: visible;
      }
      
      /* 文档目录样式优化 */
      .doc-anchor .ant-anchor-link {
        padding: 4px 0 4px 16px;
        margin: 0;
        border-left: 2px solid transparent;
        transition: all 0.2s ease;
      }
      
      .doc-anchor .ant-anchor-link:hover {
        background-color: ${token.colorBgTextHover};
      }
      
      .doc-anchor .ant-anchor-link-title {
        color: ${token.colorText};
        transition: all 0.3s;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        line-height: 1.5;
      }
      
      .doc-anchor .ant-anchor-link-active {
        background-color: ${token.colorBgTextHover};
        border-left-color: ${token.colorPrimary};
      }
      
      .doc-anchor .ant-anchor-link-active > .ant-anchor-link-title {
        color: ${token.colorPrimary};
        font-weight: 500;
      }
      
      /* 嵌套目录项样式 */
      .doc-anchor .ant-anchor-link .ant-anchor-link {
        padding-left: 28px;
      }
      
      .doc-anchor .ant-anchor-link .ant-anchor-link .ant-anchor-link {
        padding-left: 40px;
      }
      
      /* 去除默认的锚点指示器 */
      .custom-doc-anchor .ant-anchor-ink {
        display: none;
      }
      
      /* 目录展开/收起状态 */
      .doc-toc-content:not(.expanded) .ant-anchor-link .ant-anchor-link {
        display: none;
      }
      
      .doc-toc-content.expanded .ant-anchor-link .ant-anchor-link {
        display: block;
      }
      
      /* 激活状态下总是显示子项 */
      .doc-toc-content:not(.expanded) .ant-anchor-link-active .ant-anchor-link {
        display: block;
      }
      
      /* 目录卡片内部滚动条样式 */
      .toc-card {
        scrollbar-width: thin;
        scrollbar-color: ${token.colorBgElevated} transparent;
      }
      
      .toc-card::-webkit-scrollbar {
        width: 4px;
      }
      
      .toc-card::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .toc-card::-webkit-scrollbar-thumb {
        background-color: ${token.colorBgElevated};
        border-radius: 4px;
      }
      
      /* 移动端样式 */
      @media (max-width: 768px) {
        .mobile-toc-button {
          display: block;
        }
      }
      
      @media (min-width: 769px) {
        .mobile-toc-button,
        .mobile-toc-drawer {
          display: none !important;
        }
      }
      
      /* 为标题添加滚动时的过渡效果 */
      h1[id], h2[id], h3[id], h4[id], h5[id] {
        scroll-margin-top: 80px;
        transition: all 0.3s;
      }
      
      /* 标题高亮效果 */
      h1[id]:target, h2[id]:target, h3[id]:target, h4[id]:target, h5[id]:target {
        animation: highlight-animation 2s ease;
      }
      
      @keyframes highlight-animation {
        0% {
          background-color: ${token.colorPrimaryBg};
        }
        100% {
          background-color: transparent;
        }
      }
    `}</style>
  );
};

export default DocumentStyles; 