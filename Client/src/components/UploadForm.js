import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Card, Row, Col, message, Spin, Typography, Space } from 'antd';
import axios from 'axios';
import { shareByEmail, shareByWhatsApp, shareBySMS, shareAll } from '../services/shareService';
import { useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import BatchSelector from './BatchSelector'; // Assuming you have a BatchSelector component
import { API_ENDPOINTS } from '../config/apiEndpoints';
import JobStatusCard from './job-status/JobStatusCard';

const { Text } = Typography;

const { Option } = Select;

function UploadForm() {
  const [form] = Form.useForm();
  const [selectedClients, setSelectedClients] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedBatch = useSelector((state) => state.batch);

  useEffect(() => {

    if (!selectedBatch.pdfUrl || !selectedBatch.excelUrl) {
      setClientData(() => []);
      setSelectedClients(() => []);
      setLoading(() => false);
      return;
    }
    fetchClientData(selectedBatch.batchId);
  }, [selectedBatch]);

  const fetchClientData = async (batchId) => {
    try {
      setLoading(() => true)
      const response = await axios.get(API_ENDPOINTS.getClients(batchId));
      console.log(response)
      setClientData(response.data);
    } catch (error) {
      console.error('Error fetching client data:', error);
      message.error('Failed to load client data');
    }
    finally {
      setLoading(false);
    }
  };

  const handleClientSelection = (value) => {
    if (value.includes('all')) {
      setSelectedClients(clientData.map(client => client.clientId));
    } else {
      setSelectedClients(value);
    }
  };

  const handleShare = async (shareFunction, method) => {
    if (selectedClients.length === 0) {
      message.error('Please select at least one client');
      return;
    }

    if (selectedBatch.batchId === '') {
      message.error('Please select a Batch');
      return;
    }

    try {
      for (const clientId of selectedClients) {
        const client = clientData.find(c => c.clientId === clientId);
        await shareFunction(
          client.clientId,
          client.documentLink,
          localStorage.getItem('messageTemplate'),
          selectedBatch.batchId
        );
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
    if (selectedBatch.batchId === '') {
      message.error('Please select a Batch');
      return;
    }
    try {

      console.log(selectedBatch.batchId);


      for (const clientId of selectedClients) {
        console.log(clientData);

        const client = clientData.find(c => c.clientId === clientId);

        if (!client) {
          throw new Error(`Client with ID ${clientId} not found`);
        }
        await shareAll(
          client.clientId,
          client.documentLink,
          localStorage.getItem('messageTemplate'),
          selectedBatch.batchId
        );
      }
      message.success('Documents shared via all channels');
    } catch (error) {
      console.error('Error sharing documents via all channels:', error);
      message.error('Failed to share documents via all channels');
    }
  };

  const shareEntireBatch = async () => {
    if (!selectedBatch.batchId) {
      message.error('Please select a Batch');
      return;
    }
    try {
      const response = await axios.post(API_ENDPOINTS.shareEntireBatch(selectedBatch.batchId), {
        batchId: selectedBatch.batchId,
        messageTemplate: localStorage.getItem('messageTemplate')
      });
      console.log(response);
      message.success('Batch added for processing');
    } catch (error) {

      if(error.response && error.response.data?.message){
        message.error(error.response.data.message);
      }
      else{
        console.error('Error sharing batch:', error);
        message.error('Failed to share batch');
      }

    }
  }

  return (
    <Spin spinning={loading}>
      <div>
        <h2>Share Document</h2>

        {!selectedBatch.batchId ? (
          <>
            <Card
              title={
                <Space>
                  <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: "18px" }} />
                  <Text strong style={{ color: "#ff4d4f" }}>Select a Batch</Text>
                </Space>
              }
              bordered={false}
              style={{
                width: "100%",
                backgroundColor: "#fff2f0",
                border: "1px solid #ffccc7",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(255, 77, 79, 0.2)",
                padding: "16px",
              }}
            >
              <Text style={{ color: "#a8071a", fontSize: "14px", display: "block", marginBottom: "12px" }}>
                Please select a batch to share documents securely.
              </Text>
              {/* Dropdown Component Goes Here */}
              <BatchSelector />
            </Card>
          </>
        ) :

          (
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
                          <Option key={client['clientId']} value={client['clientId']}>
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
                    <Form.Item>
                      <Button onClick={shareEntireBatch} type="primary">
                        Share Entire Batch
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          )
        }

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="Job Status">
              <JobStatusCard />
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
}

export default UploadForm;
