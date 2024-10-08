import React from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import ReportSection from './components/ReportSection';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import { DashboardOutlined, UploadOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UploadOutlined />}>
              <Link to="/upload">Upload & Share</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<TeamOutlined />}>
              <Link to="/clients">Client Management</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<BarChartOutlined />}>
              <Link to="/report">Reports</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <h1 style={{ margin: '0 16px' }}>Legal Document Sharing</h1>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/upload" element={<UploadForm />} />
                <Route path="/clients" element={<ClientManagement />} />
                <Route path="/report" element={<ReportSection />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Legal Document Sharing ©2023 Created by Your Company</Footer>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
