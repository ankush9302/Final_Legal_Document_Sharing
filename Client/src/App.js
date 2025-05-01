import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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

function App() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [messageTemplate, setMessageTemplate] = useState('');

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
