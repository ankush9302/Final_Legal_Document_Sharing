import { useState, useEffect } from "react";
import { Select, Space, Typography } from "antd";
import { FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { selectBatch , clearBatch} from "../redux/batchSlice";
import { API_ENDPOINTS } from "../config/apiEndpoints";

const { Text } = Typography;

const BatchSelector = () => {
  const dispatch = useDispatch();
  const selectedBatch = useSelector((state) => state.batch); // Access batch state
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getBatches); // Replace with actual API
        setBatches(response.data);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatches();
  }, []);

  const handleSelect = (value) => {
    const selected = batches.find((batch) => batch._id === value);
    if (selected) dispatch(selectBatch(selected));
  };

  const handleClear = () => {
    dispatch(clearBatch());
  };

  return (
    <Space direction="horizontal" align="center">
      {/* Dropdown */}
      <Select
        placeholder="Select a batch"
        style={{ width: 250 }}
        onChange={handleSelect}
        value={selectedBatch.pdfOriginalName ? selectedBatch.pdfOriginalName : undefined}
        allowClear
        onClear={handleClear}
      >
        {batches.map((batch) => (
          <Select.Option key={batch._id} value={batch._id}>
            {batch.pdfOriginalName} | {batch.excelOriginalName}
          </Select.Option>
        ))}
      </Select>

      {/* Display selected items as icons */}
      {selectedBatch.pdfUrl && selectedBatch.excelUrl && (
        <Space>
          <a href={selectedBatch.pdfUrl} target="_blank" rel="noopener noreferrer">
            <FilePdfOutlined style={{ fontSize: 24, color: "red" }} />
          </a>
          <a href={selectedBatch.excelUrl} target="_blank" rel="noopener noreferrer">
            <FileExcelOutlined style={{ fontSize: 24, color: "green" }} />
          </a>
          <Text strong>{selectedBatch.pdfOriginalName}</Text>
        </Space>
      )}
    </Space>
  );
};

export default BatchSelector;
