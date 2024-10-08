import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  UserOutlined,
  FileOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import './DefaultLayout.css';

const { Header, Sider, Content, Footer } = Layout;

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapse}>
        <div className="logo">LegalDocShare</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="2" icon={<FileOutlined />}>
            Upload & Share
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
          <Menu.Item key="4" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout className="site-layout">
        {/* Header */}
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Button
            type="primary"
            onClick={toggleCollapse}
            style={{ marginLeft: 16 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </Header>

        {/* Content */}
        <Content style={{ margin: '16px', padding: '24px', background: '#fff' }}>
          {children} {/* Dynamic Content */}
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>
          Legal Document Sharing ©2024 Created by Unhappy Major Project Group
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
