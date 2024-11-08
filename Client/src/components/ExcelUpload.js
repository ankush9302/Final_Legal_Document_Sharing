import React, { useState } from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const ExcelUpload = () => {
  const [fileList, setFileList] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('excel', file);
    });

    try {
      const response = await axios.post('/api/excel/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Excel file uploaded successfully');
      setFileList([]);
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('Failed to upload Excel file');
    }
  };

  const props = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select Excel File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        style={{ marginTop: 16 }}
      >
        Upload
      </Button>
    </div>
  );
};

export default ExcelUpload;

