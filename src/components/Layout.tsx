import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentPath, onNavigate, children }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const getPageTitle = (path: string): string => {
    switch (path) {
      case '/':
        return 'Panel de Control (Dashboard)';
      case '/nuevo-registro':
        return 'Nuevo Registro de Pensamiento';
      case '/historial':
        return 'Historial de Registros';
      case '/estadisticas':
        return 'Estadísticas y Progreso';
      case '/ejercicios':
        return 'Ejercicios de Regulación Cognitiva';
      case '/biblioteca':
        return 'Biblioteca Psicoeducativa';
      case '/perfil':
        return 'Mi Perfil';
      case '/configuracion':
        return 'Configuración del Sistema';
      default:
        return 'MindBalance';
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />
      <div className="main-wrapper">
        <Header 
          title={getPageTitle(currentPath)} 
          onOpenMobileMenu={() => setIsOpenMobile(true)}
        />
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
};
export default Layout;
