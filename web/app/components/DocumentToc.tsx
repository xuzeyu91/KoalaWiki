import { Anchor, Card, Typography } from 'antd';
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';

const { Title } = Typography;

interface DocumentTocProps {
  toc: AnchorLinkItemProps[];
}

const DocumentToc: React.FC<DocumentTocProps> = ({ toc }) => {
  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <Card
      title={<Title level={5}>目录</Title>}
      style={{ height: '100%', position: 'sticky', top: 16 }}
      bodyStyle={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}
    >
      <Anchor
        items={toc}
        affix={false}
        showInkInFixed
        targetOffset={80}
      />
    </Card>
  );
};

export default DocumentToc; 