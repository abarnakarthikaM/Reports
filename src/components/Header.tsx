
import React from 'react';
import { Layout, Typography } from 'antd';
import { useCurrentDate } from '../hooks/useCurrentDate';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  productData?: any;
}

const Header: React.FC<HeaderProps> = ({ productData }) => {
  const { getFormattedDate } = useCurrentDate();

  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <Title level={3} style={{ margin: 0, color: '#001529' }}>
        AI Learning
      </Title>
      <div style={{ color: '#666' }}>
        {getFormattedDate()}
      </div>
    </AntHeader>
  );
};

export default Header;
