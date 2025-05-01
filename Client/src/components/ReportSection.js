import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Tag, Spin, Alert,Button} from 'antd';
import useReportData from '../hooks/useReportData';
import BatchSelector from './BatchSelector';
import BatchNotSelected from './BatchNotSelected';
import ShowReportStats from './report/ShowReportStats';
import { exportToExcel, exportToCSV } from './exportToFile';

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
  console.log("the data that we got is",data)
  if (loading) return <Spin tip="Loading report..." />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  const formatDataForExport = () => {
   
    return data.map((item, index) => ({
      "SNo": item.slNo,
      "Customer Name": item.customerName,
      "Borrower Email ID": item.borrowerEmailId, 
      "Final Loan Id":item.finalLoanId,
      "Loan Amount": item.loanAmount,
      "Borrower Phone Number":item.borrowerPhoneNumber,
      " Email Status": item.emailStatus || 'N/A',
      "WhatsApp Status": item.whatsappStatus || 'N/A',
      "SMS Status": item.smsStatus || 'N/A',
    }));
  };

  return (
    <>

    <ShowReportStats data={data}/>
     
    <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => exportToExcel(formatDataForExport())} style={{ marginRight: 8 }}>
          Export to Excel
        </Button>
        <Button onClick={() => exportToCSV(formatDataForExport())}>Export to CSV</Button>
      </div>
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
