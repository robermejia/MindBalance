import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRepository } from '../../services';
import { CircleUser, CheckCircle2, Heart } from 'lucide-react';

const AVATARS = [
  { emoji: '🍃', name: 'Hoja' },
  { emoji: '🌊', name: 'Ola' },
  { emoji: '⛰️', name: 'Montaña' },
  { emoji: '🌸', name: 'Flor' },
  { emoji: '☀️', name: 'Sol' },
  { emoji: '🌙', name: 'Luna' },
  { emoji: '🦉', name: 'Búho' },
  { emoji: '🍀', name: 'Trébol' }
];

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [goals, setGoals] = useState(user?.goals || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.photoURL || '🍃');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setStatusMessage(null);
    try {
      const repo = getRepository();
      await repo.updateProfile(user.uid, {
        displayName,
        goals,
        photoURL: selectedAvatar
      });
      await refreshUser();
      setStatusMessage('¡Perfil actualizado con éxito!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      setStatusMessage('Error al actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div style={{ color: 'var(--text-muted)' }}>
        Inicia sesión para ver tu perfil.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      
      {statusMessage && (
        <div className="alert alert-success fade-in">
          <CheckCircle2 size={18} />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="card fade-in">
        <h2 className="card-title">
          <CircleUser size={20} />
          Mi Perfil Terapéutico
        </h2>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
          
          {/* Avatar Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-primary)',
              border: '2px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              boxShadow: 'var(--shadow-light)'
            }}>
              {selectedAvatar.startsWith('http') ? (
                <img 
                  src={selectedAvatar} 
                  alt="Avatar de Google" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                selectedAvatar
              )}
            </div>
            
            <div>
              <label className="form-label" style={{ textAlign: 'center', marginBottom: '8px' }}>Elige un símbolo de calma</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {AVATARS.map((av) => (
                  <button
                    key={av.emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(av.emoji)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: selectedAvatar === av.emoji ? 'var(--accent-primary)' : 'var(--border-color)',
                      backgroundColor: selectedAvatar === av.emoji ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                      fontSize: '1.4rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'var(--transition-fast)'
                    }}
                    title={av.name}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }} />

          {/* Nombre */}
          <div className="form-group">
            <label className="form-label">Nombre para mostrar</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="form-input"
              placeholder="Tu nombre o apodo"
              required
            />
          </div>

          {/* Email (Solo lectura) */}
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              value={user.email || ''}
              className="form-input"
              disabled
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
            />
            <span className="form-label-desc" style={{ marginTop: '6px' }}>El correo electrónico está ligado a tu cuenta y no se puede modificar.</span>
          </div>

          {/* Objetivos */}
          <div className="form-group">
            <label className="form-label">Mis Objetivos de Bienestar</label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="form-textarea"
              placeholder="¿Qué buscas lograr usando esta aplicación? Ej. Aprender a manejar mi rumiación de pensamientos, reducir la ansiedad cotidiana..."
              rows={4}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: 'var(--text-muted)' }}>
              <Heart size={12} />
              <span style={{ fontSize: '0.75rem' }}>Escribir tus objetivos te ayuda a recordarlos y guiar tus prácticas.</span>
            </div>
          </div>

          {/* Botón de Guardar */}
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {saving ? 'Guardando Cambios...' : 'Actualizar Perfil'}
          </button>

        </form>
      </div>

    </div>
  );
};
export default Profile;
