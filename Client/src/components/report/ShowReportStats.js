import React from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
  MailOutlined,
  MessageOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';

const { Title } = Typography;


//This has to be changed.
const getStatusCount = (data, field, status) =>
  data.filter((item) => item[field]?.toLowerCase() === status.toLowerCase()).length;

const getIcon = (channel) => {
  switch (channel) {
    case 'emailStatus': return <MailOutlined />;
    case 'whatsappStatus': return <WhatsAppOutlined />;
    case 'smsStatus': return <MessageOutlined />;
    default: return null;
  }
};

const formatChannelTitle = (channel) => {
  switch (channel) {
    case 'emailStatus': return 'Email';
    case 'whatsappStatus': return 'WhatsApp';
    case 'smsStatus': return 'SMS';
    default: return '';
  }
};

//data is an array of objects, each object representing a record with status fields for each User
const ShowReportStats = ({ data }) => {
  const channels = ['emailStatus', 'whatsappStatus', 'smsStatus'];

  const channelStatus = {
    emailStatus: ['sent', 'delivered', 'opened', 'failed','clicked'],
    whatsappStatus: ["queued" , "sent", "delivered", "read", "failed"],
    smsStatus: ["queued" , "sent", "delivered", "read", "failed"],
  }
  

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Communication Stats</Title>

      {channels.map((channel) => (
        <div key={channel} style={{ marginTop: 24 }}>
          <Title level={4}>{formatChannelTitle(channel)}</Title>
          <Row gutter={[16, 16]}>
            {channelStatus[channel].map((status) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={status}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    textAlign: 'center',
                  }}
                >
                  <Statistic
                    title={status}
                    value={getStatusCount(data, channel, status)}
                    prefix={getIcon(channel)}
                    valueStyle={{ fontSize: '20px' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default ShowReportStats;
