import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DefaultLayout from './components/DefaultLayout';
import Dashboard from './components/Dashboard';
import UploadForm from './components/UploadForm';
import ClientManagement from './components/ClientManagement';
import ReportSection from './components/ReportSection';
import Register from './components/Register';
import Login from './components/Login';
import ManageSubadmin from './components/ManageSubadmin';
import CityManagement from './components/CityManagement';
import Subscription from './components/Subscription';
import ExcelUpload from './components/ExcelUpload';
import PDFUploadAndProcess from './components/PDFUploadAndProcess';
import MessageEditor from './components/MessageEditor';
import Profile from './components/Profile';
import EmailStatus from './components/EmailStatus';
import axios from 'axios';
import { setUser } from './redux/userSlice';
import { API_ENDPOINTS } from './config/apiEndpoints';

function App() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [messageTemplate, setMessageTemplate] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function getUser() {
      try {

        setLoading(()=>true);

        const token = localStorage.getItem('token');
        if (token) {
          const { data: response } = await axios.post(API_ENDPOINTS.getUserProfile, {
            token
          })
          dispatch(setUser({ name: response.data.name, role: response.data.role }));


        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
      }finally {
        setLoading(false);
      }
    }
    getUser();
  }, [])


  if(loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <DefaultLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/share-documents" element={<UploadForm />} />
                  <Route path="/subadmin-management" element={<ManageSubadmin />} />
                  <Route path="/clients" element={<ClientManagement />} />
                  <Route path="/city-management" element={<CityManagement />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/excel-upload" element={<ExcelUpload />} />
                  <Route path="/message-editor" element={<MessageEditor onSave={setMessageTemplate} />} />
                  <Route path="/pdf-processing" element={<PDFUploadAndProcess messageTemplate={messageTemplate} />} />
                  {/* <Route path="/profile" element={<Profile />} /> */}
                  {/* upper ke routes working hai */}
                  <Route path="/report" element={<ReportSection />} />
                  <Route path="/email-status" element={<EmailStatus />} />
                </Routes>
              </DefaultLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
