import React from 'react';
import { Menu, Sun, Moon, Database, CloudCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../services';

interface HeaderProps {
  title: string;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onOpenMobileMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const { useFirebase } = useAuth();
  const firebaseReady = isFirebaseConfigured();

  return (
    <header className="header">
      <div className="header-title-section">
        <button className="menu-toggle-btn" onClick={onOpenMobileMenu}>
          <Menu size={24} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h1>
      </div>

      <div className="header-actions">
        {/* Firebase / Mock Connection Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          padding: '6px 12px',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)'
        }}>
          {useFirebase && firebaseReady ? (
            <>
              <CloudCheck size={14} style={{ color: 'var(--accent-success)' }} />
              <span style={{ fontWeight: 500 }}>Firebase Activo</span>
            </>
          ) : (
            <>
              <Database size={14} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontWeight: 500 }}>Modo Local (Mock)</span>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)'
          }}
          title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
export default Header;
