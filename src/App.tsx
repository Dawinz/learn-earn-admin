import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Users } from './pages/Users';
import { Payouts } from './pages/Payouts';
import { Lessons } from './pages/Lessons';
import { Settings } from './pages/Settings';
import { VersionManagement } from './pages/VersionManagement';
import { Layout } from './components/Layout';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/users" element={<Users />} />
        <Route path="/payouts" element={<Payouts />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/version" element={<VersionManagement />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;