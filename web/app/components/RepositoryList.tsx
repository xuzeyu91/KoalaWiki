import { Col, Empty, Row } from 'antd';
import { Repository } from '../types';
import RepositoryCard from './RepositoryCard';
import { motion } from 'framer-motion';

interface RepositoryListProps {
  repositories: Repository[];
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
  if (!repositories.length) {
    return <Empty description="暂无仓库数据" />;
  }

  // 为列表项添加交错出现的动画效果
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="repository-grid"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Row gutter={[16, 16]}>
        {repositories.map((repository, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={repository.id}>
            <motion.div
              variants={item}
              custom={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <RepositoryCard repository={repository} />
            </motion.div>
          </Col>
        ))}
      </Row>
    </motion.div>
  );
};

export default RepositoryList; 