import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message } from 'antd';
import axios from 'axios';

const CityManagement = () => {
  const [cities, setCities] = useState([]);
  const [newCityName, setNewCityName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get('/api/cities');
      setCities(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cities:', error);
      message.error('Failed to load cities');
      setLoading(false);
    }
  };

  const addCity = async () => {
    if (!newCityName.trim()) {
      message.error('City name cannot be empty');
      return;
    }
    try {
      await axios.post('/api/cities', { name: newCityName });
      message.success('City added successfully');
      setNewCityName('');
      fetchCities();
    } catch (error) {
      console.error('Error adding city:', error);
      message.error('Failed to add city');
    }
  };

  const deleteCity = async (id) => {
    try {
      await axios.delete(`/api/cities/${id}`);
      message.success('City deleted successfully');
      fetchCities();
    } catch (error) {
      console.error('Error deleting city:', error);
      message.error('Failed to delete city');
    }
  };

  const columns = [
    { title: 'City Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => deleteCity(record._id)} type="danger">
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>City Management</h2>
      <Input
        value={newCityName}
        onChange={(e) => setNewCityName(e.target.value)}
        placeholder="Enter new city name"
        style={{ width: 200, marginRight: 8 }}
      />
      <Button onClick={addCity} type="primary">
        Add City
      </Button>
      <Table
        dataSource={cities}
        columns={columns}
        rowKey="_id"
        loading={loading}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default CityManagement;