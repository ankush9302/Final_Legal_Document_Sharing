import React, { useState, useEffect } from 'react';
import { Table, Button, message, Card, Space, Typography } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import BatchSelector from './BatchSelector';
import { API_ENDPOINTS } from '../config/apiEndpoints';
const { Text } = Typography;

const ClientManagement = () => {
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedBatch = useSelector((state) => state.batch);

  useEffect(() => {

    if (!selectedBatch.pdfUrl || !selectedBatch.excelUrl) {
      setClientData(() => []);
      setLoading(() => false);
      return;
    }
    fetchClientData(selectedBatch.batchId);
  }, [selectedBatch]);

  const fetchClientData = async (batchId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.getClients(batchId));
      // console.log('Raw API response:', response.data); // Log the raw response
      setClientData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching client data:', error);
      message.error('Failed to load client data');
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'CUSTOMER NAME',
      key: 'CUSTOMER NAME',
      render: (text, record) => {
        console.log('Customer Name record:', record); // Log each record
        return text || 'N/A';
      }
    },
    { title: 'Mobile Number', dataIndex: 'MOBILE NUMBER', key: 'MOBILE NUMBER' },
    { title: 'Email ID', dataIndex: 'EMAIL ID', key: 'EMAIL ID' },
    { title: 'Customer ID', dataIndex: 'CUSTOMER ID', key: 'CUSTOMER ID' },
    { title: 'Zone', dataIndex: 'ZONE', key: 'ZONE' },
    { title: 'State', dataIndex: 'STATE', key: 'STATE' },
    {
      title: 'Document Link',
      dataIndex: 'documentLink',
      key: 'documentLink',
      render: (text, record) => {
        console.log('Document Link record:', record); // Log each record for document link
        return text ? <a href={text} target="_blank" rel="noopener noreferrer">View Document</a> : 'No link available';
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button onClick={() => handleEditClient(record)}>Edit</Button>
      ),
    },
  ];

  const handleEditClient = (client) => {
    console.log('Edit client:', client);
    message.info('Edit functionality not implemented yet');
  };

  return (
    <div>
      <h2>Client Management</h2>

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
      ) : (

        <Table
          dataSource={clientData}
          columns={columns}
          rowKey="CUSTOMER ID"
          loading={loading}
          scroll={{ x: true }}
          pagination={{ pageSize: 10 }}
        />
      )}

    </div>
  );
};

export default ClientManagement;