import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { AuthShell } from './features/auth/AuthShell';
import { Dashboard } from './features/dashboard/Dashboard';
import { NewRecord } from './features/records/NewRecord';
import { History } from './features/records/History';
import { Statistics } from './features/statistics/Statistics';
import { Exercises } from './features/exercises/Exercises';
import { Library } from './features/library/Library';
import { Profile } from './features/profile/Profile';
import { Settings } from './features/settings/Settings';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-muted)',
        fontSize: '1rem',
        fontWeight: 500
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--accent-primary)',
            animation: 'spin 1s linear infinite'
          }} />
          <span>Iniciando MindBalance...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthShell />;
  }

  return (
    <Layout currentPath={location.pathname} onNavigate={(path) => navigate(path)}>
      <Routes>
        <Route path="/" element={<Dashboard onNavigate={(path) => navigate(path)} />} />
        <Route path="/nuevo-registro" element={<NewRecord onNavigate={(path) => navigate(path)} />} />
        <Route path="/historial" element={<History />} />
        <Route path="/estadisticas" element={<Statistics />} />
        <Route path="/ejercicios" element={<Exercises />} />
        <Route path="/biblioteca" element={<Library />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/configuracion" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
