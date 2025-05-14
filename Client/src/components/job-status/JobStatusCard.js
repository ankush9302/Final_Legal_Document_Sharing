import React, { useEffect, useState } from 'react';
import { Card, Progress, Spin, Typography, Row, Col } from 'antd';
import websocketService from '../../services/websocketService';
// import './JobStatusCard.css'; // Optional for custom tweaks

const { Title, Text } = Typography;

const JobStatusCard = () => {
  const [job, setJob] = useState(null);

  useEffect(() => {
    // websocketService.connect();
    const unsubscribe = websocketService.subscribeJobStatus((data) => {
        // console.log(data);
      setJob(data);
    });

    return () => unsubscribe();
  }, []);

  if (!job) {
    return (
      <Card className="job-card" bordered>
        <Text type="secondary">No job currently running.</Text>
      </Card>
    );
  }

  const {
    subject,
    clientsCompleted,
    clientsTotal,
    clientsFailed,
    status,
    jobStartTime,
    jobEndTime,
    pdfOriginalName,
    excelOriginalName,
  } = job;


  const progress = clientsTotal > 0 ? Math.round((clientsCompleted / clientsTotal) * 100) : 0;

  return (
    <Card className="job-card" bordered>
      <Row align="middle" justify="space-between">
        <Col>
          <Title level={4} style={{ marginBottom: 0 }}>{subject}</Title>
          <Text type="secondary">Status: </Text>
          <Text strong>{status}</Text>
        </Col>
        {status === 'running' && (
          <Spin size="large" style={{ marginRight: 10 }} spinning />
        )}
      </Row>

      <Progress percent={progress} status={status === 'completed' ? 'success' : 'active'} showInfo />

      <Row gutter={[16, 8]} style={{ marginTop: 12 }}>
        <Col xs={12} sm={8}>
          <Text><strong>Completed:</strong> {clientsCompleted} / {clientsTotal}</Text>
        </Col>
        <Col xs={12} sm={8}>
          <Text><strong>Failures:</strong> {clientsFailed}</Text>
        </Col>
        <Col xs={12} sm={8}>
          <Text><strong>PDF:</strong> {pdfOriginalName}</Text>
        </Col>
        <Col xs={12} sm={8}>
          <Text><strong>Excel:</strong> {excelOriginalName}</Text>
        </Col>
        <Col xs={12} sm={8}>
          <Text><strong>Start:</strong> {jobStartTime ? new Date(jobStartTime).toLocaleTimeString() : 'N/A'}</Text>
        </Col>
        <Col xs={12} sm={8}>
          <Text><strong>End:</strong> {jobEndTime ? new Date(jobEndTime).toLocaleTimeString() : 'Ongoing'}</Text>
        </Col>
      </Row>
    </Card>
  );
};

export default JobStatusCard;
