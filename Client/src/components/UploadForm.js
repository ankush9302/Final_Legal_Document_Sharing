import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Card, Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import { shareByEmail, shareByWhatsApp, shareBySMS, shareAll } from '../services/shareService';

const { Option } = Select;

function UploadForm() {
  const [form] = Form.useForm();
  const [selectedClients, setSelectedClients] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/document-links');
      setClientData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching client data:', error);
      message.error('Failed to load client data');
      setLoading(false);
    }
  };

  const handleClientSelection = (value) => {
    if (value.includes('all')) {
      setSelectedClients(clientData.map(client => client['CUSTOMER ID']));
    } else {
      setSelectedClients(value);
    }
  };

  const handleShare = async (shareFunction, method) => {
    if (selectedClients.length === 0) {
      message.error('Please select at least one client');
      return;
    }

    try {
      for (const clientId of selectedClients) {
        const client = clientData.find(c => c['CUSTOMER ID'] === clientId);
        await shareFunction(client['CUSTOMER ID'], client.documentLink);
      }
      message.success(`Documents shared via ${method}`);
    } catch (error) {
      console.error(`Error sharing documents via ${method}:`, error);
      message.error(`Failed to share documents via ${method}`);
    }
  };

  const handleShareAll = async () => {
    if (selectedClients.length === 0) {
      message.error('Please select at least one client');
      return;
    }

    try {
      for (const clientId of selectedClients) {
        const client = clientData.find(c => c['CUSTOMER ID'] === clientId);
        await shareAll(client['CUSTOMER ID'], client.documentLink);
      }
      message.success('Documents shared via all channels');
    } catch (error) {
      console.error('Error sharing documents via all channels:', error);
      message.error('Failed to share documents via all channels');
    }
  };

  return (
    <Spin spinning={loading}>
      <div>
        <h2>Share Document</h2>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Select Client and Share">
              <Form form={form} layout="vertical">
                <Form.Item name="clients" label="Select Clients">
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select clients"
                    onChange={handleClientSelection}
                    value={selectedClients}
                  >
                    <Option key="all" value="all">Select All</Option>
                    {clientData.map(client => (
                      <Option key={client['CUSTOMER ID']} value={client['CUSTOMER ID']}>
                        {client['CUSTOMER NAME']}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button onClick={() => handleShare(shareByEmail, 'email')} type="primary" style={{ marginRight: 8 }}>
                    Share by Email
                  </Button>
                  <Button onClick={() => handleShare(shareByWhatsApp, 'WhatsApp')} type="primary" style={{ marginRight: 8 }}>
                    Share by WhatsApp
                  </Button>
                  <Button onClick={() => handleShare(shareBySMS, 'SMS')} type="primary" style={{ marginRight: 8 }}>
                    Share by SMS
                  </Button>
                  <Button onClick={handleShareAll} type="primary">
                    Share All
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
}

export default UploadForm;
