import { useEffect, useState } from 'react';
import axios from 'axios';

const useReportData = (batchId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!batchId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/reports/${batchId}/getreport`);
        setData(response.data); // Assumes API returns the array directly
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [batchId]);

  return { data, loading, error };
};

export default useReportData;
