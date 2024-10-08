import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Select, Row, Col, Card } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportSection = () => {
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [reportType, setReportType] = useState('all');

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    try {
      const response = await fetch(`/api/report?startDate=${dateRange?.[0]}&endDate=${dateRange?.[1]}&type=${reportType}`);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Document', dataIndex: 'document', key: 'document' },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div>
      <h2>Report Section</h2>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Report Filters">
            <RangePicker
              style={{ width: '100%', marginBottom: 16 }}
              onChange={(dates) => setDateRange(dates)}
            />
            <Select
              style={{ width: '100%' }}
              placeholder="Select report type"
              onChange={(value) => setReportType(value)}
            >
              <Option value="all">All Reports</Option>
              <Option value="email">Email Reports</Option>
              <Option value="whatsapp">WhatsApp Reports</Option>
              <Option value="sms">SMS Reports</Option>
            </Select>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Report Data">
            <Table dataSource={reportData} columns={columns} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportSection;