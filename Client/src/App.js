import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DefaultLayout from './components/DefaultLayout';
import Dashboard from './components/Dashboard';
import UploadForm from './components/UploadForm';
import ClientManagement from './components/ClientManagement';
import ReportSection from './components/ReportSection';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

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
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadForm />} />
                  <Route path="/clients" element={<ClientManagement />} />
                  <Route path="/report" element={<ReportSection />} />
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
