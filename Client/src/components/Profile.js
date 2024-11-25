import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Avatar, Descriptions, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, SendOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [stats, setStats] = useState({
    totalEmailsSent: 0,
    totalWhatsAppSent: 0,
    totalSMSSent: 0,
    documentsShared: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/user/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Avatar size={100} icon={<UserOutlined />} />
                <h2 style={{ marginTop: '16px' }}>{user.name}</h2>
                <p>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
              </div>

              <Descriptions bordered>
                <Descriptions.Item label={<><MailOutlined /> Email</>} span={3}>
                  {user.email}
                </Descriptions.Item>
                <Descriptions.Item label={<><PhoneOutlined /> Phone</>} span={3}>
                  {user.phone}
                </Descriptions.Item>
                <Descriptions.Item label={<><HomeOutlined /> Address</>} span={3}>
                  {user.address}
                </Descriptions.Item>
                <Descriptions.Item label="City" span={3}>
                  {user.city}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Emails Sent"
                value={stats.totalEmailsSent}
                prefix={<MailOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="WhatsApp Messages"
                value={stats.totalWhatsAppSent}
                prefix={<SendOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="SMS Sent"
                value={stats.totalSMSSent}
                prefix={<SendOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Documents Shared"
                value={stats.documentsShared}
                prefix={<SendOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default Profile;