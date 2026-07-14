import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wind, Lock, Mail, ShieldAlert } from 'lucide-react';

export const AuthShell: React.FC = () => {
  const { login, signup, loginWithGoogle, useFirebase, toggleFirebase } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, useFirebase ? password : '');
      } else {
        await signup(email, useFirebase ? password : '');
      }
    } catch (err: any) {
      console.error("Error de autenticación:", err);
      setError(
        err.message || 
        'Ocurrió un error. Verifica tus credenciales o el estado de la conexión.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Error de Google Sign-In:", err);
      setError(err.message || 'Error al iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      padding: '20px'
    }} className="fade-in">
      
      <div style={{ maxWidth: '440px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Logo de la App */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'var(--accent-primary-light)',
            color: 'var(--accent-primary)',
            marginBottom: '12px'
          }}>
            <Wind size={30} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }} className="text-gradient-cyan">MindBalance</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Entrenamiento Cognitivo Basado en Evidencia (TCC)
          </p>
        </div>

        {/* Formulario */}
        <div className="card">
          
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <button
              onClick={() => { setIsLogin(true); setError(null); }}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                padding: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                color: isLogin ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: isLogin ? '2px solid var(--accent-primary)' : '2px solid transparent',
                transition: 'var(--transition-fast)'
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); }}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                padding: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                color: !isLogin ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: !isLogin ? '2px solid var(--accent-primary)' : '2px solid transparent',
                transition: 'var(--transition-fast)'
              }}
            >
              Crear Cuenta
            </button>
          </div>

          {error && (
            <div className="alert alert-warning" style={{ fontSize: '0.85rem', padding: '12px' }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Correo Electrónico</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
            </div>

            {/* Contraseña (solo requerida si Firebase está activo) */}
            {(!useFirebase) ? (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-8px' }}>
                * Modo Local activo: no requieres contraseña para probar la aplicación.
              </span>
            ) : (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
            >
              {loading ? 'Cargando...' : (isLogin ? 'Ingresar a MindBalance' : 'Registrar Cuenta')}
            </button>
          </form>

          {/* Google Sign In */}
          {useFirebase && (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>O CONTINUAR CON</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
              </div>
              
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="btn btn-secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '4px' }}>
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.63v3.02h3.88c2.28-2.1 3.57-5.18 3.57-8.5z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.02c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.11C3.18 21.88 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.62H1.21C.44 8.16 0 9.88 0 11.7s.44 3.54 1.21 5.08l4.11-3.11z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.08l4.11 3.11c.94-2.85 3.57-4.96 6.68-4.96z"/>
                </svg>
                Acceder con Google
              </button>
            </div>
          )}

          {/* Selector de Base de Datos para salir del deadlock */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <button
              type="button"
              onClick={() => {
                toggleFirebase(!useFirebase);
                setError(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {useFirebase 
                ? "Cambiar a Modo Local (Sin Conexión/Evaluación)" 
                : "Cambiar a Modo Sincronizado (Firebase)"}
            </button>
          </div>

        </div>

        {/* Descargo de Responsabilidad Ético */}
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--accent-primary-light)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <ShieldAlert size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', color: 'var(--text-primary)', marginBottom: '2px' }}>
              Aviso Importante de Salud Mental
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', display: 'block' }}>
              MindBalance no diagnostica enfermedades ni reemplaza a un psicólogo o a un psiquiatra. Esta aplicación únicamente ayuda al usuario a entrenar habilidades cognitivas inspiradas en la Terapia Cognitivo-Conductual (TCC).
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
export default AuthShell;
