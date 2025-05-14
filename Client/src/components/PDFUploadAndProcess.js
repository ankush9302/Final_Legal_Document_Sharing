import React, { useState } from 'react';
import { Upload, message, Button, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiEndpoints';

const PDFUploadAndProcess = ({ messageTemplate }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pagesPerSplit, setPagesPerSplit] = useState(1);

  const handleUpload = async () => {
    if (!pdfFile || !excelFile) {
      message.error('Please select both PDF and Excel files');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('excel', excelFile);
    formData.append('pagesPerSplit', pagesPerSplit);
    formData.append('messageTemplate', messageTemplate);

    setUploading(true);

    try {
      await axios.post(API_ENDPOINTS.pdfProcess, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Files uploaded successfully');
    } catch (error) {
      console.error('Error uploading files:', error);
      message.error('Failed to upload files');
    } finally {
      setUploading(false);
      setPdfFile(null);
      setExcelFile(null);
    }
  };

  const pdfProps = {
    onRemove: () => {
      setPdfFile(null);
    },
    beforeUpload: (file) => {
      setPdfFile(file);
      return false;
    },
    fileList: pdfFile ? [pdfFile] : [],
  };

  const excelProps = {
    onRemove: () => {
      setExcelFile(null);
    },
    beforeUpload: (file) => {
      setExcelFile(file);
      return false;
    },
    fileList: excelFile ? [excelFile] : [],
  };

  return (
    <div>
      <Upload {...pdfProps}>
        <Button icon={<UploadOutlined />}>Select PDF</Button>
      </Upload>
      <Upload {...excelProps} style={{ marginTop: 16 }}>
        <Button icon={<UploadOutlined />}>Select Excel</Button>
      </Upload>
      <Input
        type="number"
        min={1}
        value={pagesPerSplit}
        onChange={(e) => setPagesPerSplit(e.target.value)}
        placeholder="Number of pages per split"
        style={{ marginTop: 16 }}
      />
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={!pdfFile || !excelFile}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Upload Files'}
      </Button>
    </div>
  );
};

export default PDFUploadAndProcess;
