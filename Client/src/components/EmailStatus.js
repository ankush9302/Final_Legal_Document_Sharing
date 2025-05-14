import React, { useState, useEffect } from 'react';
import { Table, Tabs, Button, message } from 'antd';
import axios from 'axios';

const { TabPane } = Tabs;

const EmailStatus = () => {
  const [emailData, setEmailData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const columns = [
    {
      title: 'Client Name',
      dataIndex: ['clientId', 'name'],
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'sentTo',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: ['email', 'status'],
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'delivered' ? 'green' : 
                 status === 'failed' ? 'red' : 'orange' 
        }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Opened',
      dataIndex: ['email', 'opened'],
      key: 'opened',
      render: (opened) => (opened ? 'Yes' : 'No'),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  const fetchEmailData = async (type) => {
    setLoading(true);
    try {
      let endpoint = '/api/email-status';
      switch (type) {
        case 'failed':
          endpoint = '/api/email-status/failed';
          break;
        case 'success':
          endpoint = '/api/email-status/success';
          break;
        case 'opened':
          endpoint = '/api/email-status/opened';
          break;
        default:
          endpoint = '/api/email-status';
      }
      const response = await axios.get(endpoint);
      setEmailData(response.data);
    } catch (error) {
      console.error('Error fetching email data:', error);
      message.error('Failed to fetch email data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEmailData(activeTab);

    // Subscribe to WebSocket updates
    const ws = new WebSocket(`ws://${window.location.hostname}:5000`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received WebSocket message:', message);
      
      if (message.type === 'MAILGUN_EVENT') {
        console.log('Updating email status with:', message.data);
        updateEmailStatus(message.data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [activeTab]);

  const updateEmailStatus = (eventData) => {
    setEmailData(prevData => {
      return prevData.map(email => {
        if (email.sentTo === eventData.recipient) {
          return {
            ...email,
            email: {
              ...email.email,
              status: eventData.type,
              opened: eventData.type === 'opened' ? true : email.email.opened
            }
          };
        }
        return email;
      });
    });
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.get('/api/email-status/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'email_status.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting excel:', error);
      message.error('Failed to export excel file');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleExportExcel}>
          Export to Excel
        </Button>
      </div>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="All Emails" key="all">
          <Table 
            columns={columns} 
            dataSource={emailData}
            loading={loading}
            rowKey="_id"
          />
        </TabPane>
        <TabPane tab="Failed Emails" key="failed">
          <Table 
            columns={columns} 
            dataSource={emailData}
            loading={loading}
            rowKey="_id"
          />
        </TabPane>
        <TabPane tab="Successful Emails" key="success">
          <Table 
            columns={columns} 
            dataSource={emailData}
            loading={loading}
            rowKey="_id"
          />
        </TabPane>
        <TabPane tab="Opened Emails" key="opened">
          <Table 
            columns={columns} 
            dataSource={emailData}
            loading={loading}
            rowKey="_id"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EmailStatus;