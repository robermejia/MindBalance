import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardPen, 
  History, 
  BarChart3, 
  Brain, 
  BookOpen, 
  CircleUser, 
  Settings, 
  LogOut, 
  Wind,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPath, 
  onNavigate, 
  isOpenMobile, 
  onCloseMobile 
}) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Nuevo Registro', path: '/nuevo-registro', icon: ClipboardPen },
    { name: 'Historial', path: '/historial', icon: History },
    { name: 'Estadísticas', path: '/estadisticas', icon: BarChart3 },
    { name: 'Ejercicios TCC', path: '/ejercicios', icon: Brain },
    { name: 'Biblioteca TCC', path: '/biblioteca', icon: BookOpen },
    { name: 'Perfil', path: '/perfil', icon: CircleUser },
    { name: 'Configuración', path: '/configuracion', icon: Settings },
  ];

  const handleItemClick = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  return (
    <aside className={`sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-logo text-gradient-cyan">
          <Wind size={26} strokeWidth={2.5} />
          MindBalance
        </span>
        <button 
          className="menu-toggle-btn" 
          onClick={onCloseMobile} 
          style={{ display: isOpenMobile ? 'block' : 'none' }}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => handleItemClick(item.path)}
              style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%' }}
            >
              <Icon size={20} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary-light)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '14px'
            }}>
              {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.displayName}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="sidebar-item"
            style={{ 
              background: 'none', 
              border: 'none', 
              textAlign: 'left', 
              width: '100%', 
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      )}
    </aside>
  );
};
