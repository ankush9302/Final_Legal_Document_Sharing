import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, message, Modal, Table } from 'antd';
import { UserOutlined, FileOutlined, SendOutlined, CloudUploadOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getEmailStats } from '../services/api';
import websocketService from '../services/websocketService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalClients: 0,
    totalDocuments: 0,
    documentsSentToday: 0,
    recentUploads: 0,
    emailStats: {
      total: 0,
      accepted: 0,
      delivered: 0,
      failed: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
      clickRate: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [failedEmails, setFailedEmails] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchDashboardData();

    websocketService.connect();

    const unsubscribe = websocketService.subscribe((emailStats) => {
      setDashboardData(prevData => ({
        ...prevData,
        emailStats
      }));
    });

    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, emailStatsResponse] = await Promise.all([
        // axios.get('api/email-stats'),
        getEmailStats(),//They were the same route. idk why we have to call them twice and separately when they are the same
        getEmailStats()
      ]);
      setDashboardData({
        ...dashboardResponse.data,
        emailStats: emailStatsResponse.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const showFailedEmails = async () => {
    try {
      const response = await axios.get('/api/messages/failed-emails');
      setFailedEmails(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching failed emails:', error);
      message.error('Failed to load failed emails');
    }
  };

  const failedEmailColumns = [
    { title: 'Client Name', dataIndex: ['client', 'name'], key: 'name' },
    { title: 'Email', dataIndex: 'sentTo', key: 'email' },
    { title: 'Date', dataIndex: 'createdAt', key: 'date', 
      render: (text) => new Date(text).toLocaleDateString() 
    },
    { title: 'Error', dataIndex: 'error', key: 'error' }
  ];

  return (
    <Spin spinning={loading}>
      <div>
        <h2>Dashboard</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Clients"
                value={dashboardData.totalClients}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Documents"
                value={dashboardData.totalDocuments}
                prefix={<FileOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Documents Sent Today"
                value={dashboardData.documentsSentToday}
                prefix={<SendOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Recent Uploads"
                value={dashboardData.recentUploads}
                prefix={<CloudUploadOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <h3 style={{ marginTop: 24 }}>Email Statistics</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Emails"
                value={dashboardData.emailStats.total}
                prefix={<MailOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Delivered"
                value={dashboardData.emailStats.delivered}
                valueStyle={{ color: '#3f8600' }}
                prefix={<MailOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card onClick={showFailedEmails} style={{ cursor: 'pointer' }}>
              <Statistic
                title="Failed"
                value={dashboardData.emailStats.failed}
                valueStyle={{ color: '#cf1322' }}
                prefix={<MailOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Opened"
                value={dashboardData.emailStats.opened}
                valueStyle={{ color: '#1890ff' }}
                prefix={<MailOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Clicked"
                value={dashboardData.emailStats.clicked}
                valueStyle={{ color: '#722ed1' }}
                prefix={<MailOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Open Rate"
                value={dashboardData.emailStats.openRate}
                precision={2}
                valueStyle={{ color: '#13c2c2' }}
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Click Rate"
                value={dashboardData.emailStats.clickRate}
                precision={2}
                valueStyle={{ color: '#eb2f96' }}
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Pending"
                value={dashboardData.emailStats.total - dashboardData.emailStats.delivered - dashboardData.emailStats.failed}
                valueStyle={{ color: '#faad14' }}
                prefix={<MailOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Modal
          title="Failed Emails"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
        >
          <Table
            dataSource={failedEmails}
            columns={failedEmailColumns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        </Modal>
      </div>
    </Spin>
  );
};

export default Dashboard;