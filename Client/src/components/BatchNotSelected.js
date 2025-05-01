
import React from 'react';
import { Card, Typography, Space } from 'antd';
import { useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import BatchSelector from './BatchSelector'; // Assuming you have a BatchSelector component
const { Text } = Typography;
export default function BatchNotSelected() {

    const selectedBatch = useSelector((state) => state.batch);

    if (selectedBatch.batchId) {
        return null; // If a batch is selected, render nothing
    }

    return (
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
    );
}