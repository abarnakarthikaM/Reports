
import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { TeamOutlined, ProjectOutlined, FileTextOutlined, BookOutlined } from '@ant-design/icons';
import type { MenuItem } from '../types';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuData: MenuItem[] = [
    {
      mainmenu: 'Team Activity',
      submenu: [
        {
          name: 'Today Plan',
          route: '/todayplan'
        },
        {
          name: 'Vallarchi',
          route: '/vallarchi'
        }
      ]
    },
    {
      mainmenu: 'Product',
      submenu: [
        {
          name: 'Sprint',
          route: '/sprint'
        },
        {
          name: 'Documents',
          route: '/documents'
        }
      ]
    }
  ];

  const menuItems = menuData.map((item, index) => ({
    key: `sub${index}`,
    icon: index === 0 ? <TeamOutlined /> : <ProjectOutlined />,
    label: item.mainmenu,
    children: item.submenu.map((subItem, subIndex) => ({
      key: subItem.route,
      icon: subItem.name === 'Today Plan' ? <FileTextOutlined /> : 
            subItem.name === 'Vallarchi' ? <BookOutlined /> : 
            <FileTextOutlined />,
      label: subItem.name,
      onClick: () => navigate(subItem.route)
    }))
  }));

  return (
    <Sider 
      collapsible 
      breakpoint="lg"
      collapsedWidth="0"
      style={{ background: '#001529' }}
    >
      <div style={{ 
        height: '64px', 
        margin: '16px', 
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        Menu
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
