import React, { useState, useEffect } from 'react';
import { Table, Input } from 'antd';

const ClientDataTable = ({ clientData }) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(clientData);
  }, [clientData]);

  const handleSearch = (value) => {
    const filtered = clientData.filter(
      (item) =>
        item['CUSTOMER NAME'].toLowerCase().includes(value.toLowerCase()) ||
        item['MOBILE NUMBER'].toString().includes(value) ||
        item['EMAIL ID'].toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns = [
    { title: 'Customer Name', dataIndex: 'CUSTOMER NAME', key: 'CUSTOMER NAME' },
    { title: 'Mobile Number', dataIndex: 'MOBILE NUMBER', key: 'MOBILE NUMBER' },
    { title: 'Email ID', dataIndex: 'EMAIL ID', key: 'EMAIL ID' },
    { title: 'Customer ID', dataIndex: 'CUSTOMER ID', key: 'CUSTOMER ID' },
    { title: 'Zone', dataIndex: 'ZONE', key: 'ZONE' },
    { title: 'State', dataIndex: 'STATE', key: 'STATE' },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Search by name, mobile, or email"
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="CUSTOMER ID"
        scroll={{ x: true }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ClientDataTable;