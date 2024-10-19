import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import axios from 'axios';

const ClientManagement = () => {
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/document-links');
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
      <Table
        dataSource={clientData}
        columns={columns}
        rowKey="CUSTOMER ID"
        loading={loading}
        scroll={{ x: true }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ClientManagement;