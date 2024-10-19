import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SubAdmin.css';
import { message } from 'antd';

const SubadminPage = () => {
  const [unverifiedSubadmins, setUnverifiedSubadmins] = useState([]);
  const [subadmins, setSubadmins] = useState([]);
  const [cities, setCities] = useState([]);
  const [editingSubadmin, setEditingSubadmin] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [loading, setLoading] = useState({ fetching: false, approving: false });

  useEffect(() => {
    fetchSubadmins();
    fetchCities();
  }, []);

  const fetchSubadmins = async () => {
    try {
      setLoading(prev => ({ ...prev, fetching: true }));
      const response = await axios.get('/api/subadmins/all');
      setSubadmins(response.data.filter(subadmin => subadmin.verified));
      setUnverifiedSubadmins(response.data.filter(subadmin => !subadmin.verified));
    } catch (error) {
      console.error('Error fetching subadmins:', error);
      message.error('Failed to fetch subadmins');
    } finally {
      setLoading(prev => ({ ...prev, fetching: false }));
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get('/api/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      message.error('Failed to fetch cities');
    }
  };

  const approveSubadmin = async (subadminId) => {
    setLoading(prev => ({ ...prev, approving: true }));
    try {
      await axios.put(`/api/subadmins/${subadminId}/approve`);
      message.success('Subadmin approved successfully');
      fetchSubadmins();
    } catch (error) {
      console.error('Error approving subadmin:', error);
      message.error('Failed to approve subadmin');
    } finally {
      setLoading(prev => ({ ...prev, approving: false }));
    }
  };

  const deleteSubadmin = async (id) => {
    try {
      await axios.delete(`/api/subadmins/${id}`);
      message.success('Subadmin deleted successfully');
      fetchSubadmins();
    } catch (error) {
      console.error('Error deleting subadmin:', error);
      message.error('Failed to delete subadmin');
    }
  };

  const handleCityChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedCities(selected);
  };

  const saveSubadminCities = async (id) => {
    try {
      await axios.put(`/api/subadmins/${id}/cities`, { cities: selectedCities });
      message.success('Subadmin cities updated successfully');
      setEditingSubadmin(null);
      fetchSubadmins();
    } catch (error) {
      console.error('Error updating subadmin cities:', error);
      message.error('Failed to update subadmin cities');
    }
  };

  return (
    <div className="subadmin-page">
      <h1>Subadmin Management</h1>
      {/* Unverified Subadmin Requests */}
      {loading.fetching ? (
        <div>Loading...</div>
      ) : (
        <>
          <section className="subadmin-section">
            <h2>Unverified Subadmin Requests</h2>
            <table className="subadmin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {unverifiedSubadmins.length > 0 ? (
                  unverifiedSubadmins.map(subadmin => (
                    <tr key={subadmin._id}>
                      <td>{subadmin.name}</td>
                      <td>{subadmin.email}</td>
                      <td>{subadmin.city || 'Unknown'}</td> {/* Optional chaining to handle missing cities */}
                      <td>
                        <button
                          className="subadmin-button"
                          onClick={() => approveSubadmin(subadmin._id)}
                          disabled={loading.approving}
                        >
                          {loading.approving ? 'Approving...' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No unverified subadmins</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
          {/* Verified Subadmins */}
          <section className="subadmin-section">
            <h2>Verified Subadmins</h2>
            <table className="subadmin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Permissible Cities</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subadmins.length > 0 ? (
                  subadmins.map((subadmin) => (
                    <tr key={subadmin._id}>
                      <td>{subadmin.name}</td>
                      <td>{subadmin.email}</td>
                      <td>
                        {editingSubadmin === subadmin._id ? (
                          <>
                            <select
                              className="subadmin-select"
                              multiple
                              value={selectedCities}
                              onChange={handleCityChange}
                            >
                              {cities.length > 0 ? cities.map((city) => (
                                <option key={city._id} value={city._id}>
                                  {city.name}
                                </option>
                              )) : <option disabled>No cities available</option>} {/* Handling empty cities */}
                            </select>
                            <button
                              className="subadmin-button"
                              onClick={() => saveSubadminCities(subadmin._id)}
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          (subadmin.permissibleCities || []).map((cityId) => {
                            const city = cities.find((c) => c._id === cityId);
                            return city ? city.name : 'Unknown';  {/* Handling unknown permissibleCities */}
                          }).join(', ')
                        )}
                      </td>
                      <td>
                        <button className="subadmin-button" onClick={() => {
                          setSelectedCities(subadmin.permissibleCities || []);  {/* Set selected cities on edit */}
                          setEditingSubadmin(subadmin._id);
                        }}>
                          Edit Cities
                        </button>
                        <button className="subadmin-button delete" onClick={() => deleteSubadmin(subadmin._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No verified subadmins</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
};

export default SubadminPage;
