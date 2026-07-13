import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Database, 
  CloudCheck, 
  ShieldAlert, 
  RefreshCw, 
  Trash2, 
  Languages, 
  Sun, 
  Moon, 
  CheckCircle2 
} from 'lucide-react';
import { mockRepositoryInstance } from '../../services/mockRepository';
import { isFirebaseConfigured } from '../../services';

export const Settings: React.FC = () => {
  const { user, useFirebase, toggleFirebase, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const firebaseReady = isFirebaseConfigured();

  const handlePopulateData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await mockRepositoryInstance.populateMockData(user.uid);
      setStatusMessage({
        type: 'success',
        text: '¡Datos de prueba cargados con éxito! Ahora puedes ver el Dashboard y las Estadísticas completamente llenas.'
      });
      // Refrescar usuario para actualizar objetivos u otros campos
      await refreshUser();
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Error al cargar los datos de prueba.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todos los datos locales? Esta acción no se puede deshacer.')) {
      localStorage.clear();
      setStatusMessage({
        type: 'success',
        text: 'Todos los datos locales han sido borrados. La página se recargará para reiniciar la sesión.'
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {statusMessage && (
        <div className={`alert alert-${statusMessage.type}`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tema e Idioma */}
      <div className="card">
        <h2 className="card-title">
          <Languages size={20} />
          Preferencias Generales
        </h2>
        
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '2px' }}>Modo Visual</label>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Alterna entre el tema claro y oscuro de la interfaz</span>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={toggleTheme}
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </button>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '2px' }}>Idioma de la Aplicación</label>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Selecciona el idioma de los textos y formularios</span>
          </div>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
            className="form-select"
            style={{ width: '150px', padding: '8px 12px' }}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Firebase Config */}
      <div className="card">
        <h2 className="card-title">
          <Database size={20} />
          Conexión con Base de Datos
        </h2>
        
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
          MindBalance puede almacenar tus registros localmente en el navegador (adecuado para privacidad total y uso inmediato) o sincronizarse con una base de datos segura en la nube mediante Firebase (Firestore + Authentication).
        </p>

        <div className="form-group" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '16px', 
          backgroundColor: 'var(--bg-primary)', 
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          marginBottom: '24px'
        }}>
          <div>
            <span style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              {useFirebase ? 'Firebase Sincronizado' : 'Almacenamiento Local Activo'}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {useFirebase 
                ? 'Los datos se guardan en la nube de forma segura y se sincronizan entre dispositivos.' 
                : 'Los datos se guardan únicamente en el almacenamiento interno de este navegador.'}
            </span>
          </div>
          <button
            onClick={() => {
              if (useFirebase) {
                toggleFirebase(false);
                setStatusMessage({ type: 'success', text: 'Cambiado a Modo Local (Mock). Los datos se guardan en tu navegador.' });
              } else {
                if (firebaseReady) {
                  toggleFirebase(true);
                  setStatusMessage({ type: 'success', text: 'Cambiado a Modo Firebase. Tus datos ahora se sincronizan en la nube.' });
                } else {
                  setStatusMessage({ type: 'error', text: 'Firebase no está configurado correctamente en el código. Verifica las credenciales.' });
                }
              }
            }}
            className={`btn ${useFirebase ? 'btn-secondary' : 'btn-primary'}`}
            style={{ padding: '8px 16px' }}
          >
            {useFirebase ? 'Desactivar Firebase' : 'Activar Firebase'}
          </button>
        </div>

        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>Credenciales de Firebase</h3>
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            border: '1px solid var(--border-color)',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {`{
  apiKey: "AIzaSyCUwLMBtmc_tFuuAiW1BwUEaGd8HLxX0s0",
  authDomain: "mindbalance-514f8.firebaseapp.com",
  projectId: "mindbalance-514f8",
  storageBucket: "mindbalance-514f8.firebasestorage.app",
  messagingSenderId: "870536535995",
  appId: "1:870536535995:web:17a88fddd6c169a4db6e9e"
}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {firebaseReady ? (
              <>
                <CloudCheck size={16} style={{ color: 'var(--accent-success)' }} />
                <span>Credenciales válidas. Conexión establecida con éxito con Firestore y Firebase Auth.</span>
              </>
            ) : (
              <>
                <ShieldAlert size={16} style={{ color: 'var(--accent-warning)' }} />
                <span>Credenciales ausentes o erróneas. Se forzará el modo local de respaldo.</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Simulación y Reset */}
      <div className="card">
        <h2 className="card-title" style={{ color: '#EF4444' }}>
          <ShieldAlert size={20} />
          Herramientas de Datos (Demostración)
        </h2>
        
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
          Utiliza estas funciones para poblar registros ficticios en la base de datos local y evaluar el funcionamiento de las estadísticas, el panel de control y los historiales de forma instantánea.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={handlePopulateData}
            disabled={loading}
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--accent-cyan)', borderColor: 'var(--accent-cyan)' }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Poblar con Datos de Prueba (Recomendado)
          </button>
          
          <button
            onClick={handleClearData}
            className="btn btn-secondary"
            style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
          >
            <Trash2 size={16} />
            Borrar Todo el Almacenamiento Local
          </button>
        </div>
      </div>

    </div>
  );
};
export default Settings;
