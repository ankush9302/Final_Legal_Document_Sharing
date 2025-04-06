import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Tag, Spin, Alert } from 'antd';
import useReportData from '../hooks/useReportData';
import BatchSelector from './BatchSelector';
import BatchNotSelected from './BatchNotSelected';
import ShowReportStats from './report/ShowReportStats';

const statusColors = {
  'Sent': 'blue',
  'Delivered': 'green',
  'Opened': 'gold',
  'Failed': 'red',
  'Clicked': 'purple',
  'Not Sent': 'default',
};

const columns = [
  {
    title: 'Customer Name',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    title: 'Email',
    dataIndex: 'borrowerEmailId',
    key: 'borrowerEmailId',
  },
  {
    title: 'Phone',
    dataIndex: 'borrowerPhoneNumber',
    key: 'borrowerPhoneNumber',
  },
  {
    title: 'WhatsApp Status',
    dataIndex: 'whatsappStatus',
    key: 'whatsappStatus',
    render: (status) => <Tag color={statusColors[status] || 'default'}>{status}</Tag>,
  },
  {
    title: 'Email Status',
    dataIndex: 'emailStatus',
    key: 'emailStatus',
    render: (status) => <Tag color={statusColors[status] || 'default'}>{status}</Tag>,
  },
  {
    title: 'SMS Status',
    dataIndex: 'smsStatus',
    key: 'smsStatus',
    render: (status) => <Tag color={statusColors[status] || 'default'}>{status}</Tag>,
  },
];

const ReportTable = () => {
  const selectedBatch = useSelector((state) => state.batch);
  const batchId = selectedBatch?.batchId;

  const { data, loading, error } = useReportData(batchId);

  if (!batchId) {
    return <BatchNotSelected/>;
  }

  if (loading) return <Spin tip="Loading report..." />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <>

    <ShowReportStats data={data}/>

    <Table
      dataSource={data}
      columns={columns}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
      />
      </>
  );
};

export default ReportTable;
