import React, { useEffect, useState } from 'react';
import { 
  Smile, 
  Handshake, 
  Users, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Info
} from 'lucide-react';
import { getRepository } from '../../services';
import type { AttentionRecord } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const AttentionTraining: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<AttentionRecord[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isDark = theme === 'dark';
  const tickColor = isDark ? '#94A3B8' : '#475569';
  const textSecondaryColor = isDark ? '#CBD5E1' : '#334155';
  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const tooltipBg = isDark ? '#1E293B' : '#FFFFFF';
  const tooltipTitle = isDark ? '#F8FAFC' : '#0F172A';
  const tooltipBody = isDark ? '#94A3B8' : '#475569';
  const tooltipBorder = isDark ? '#334155' : '#E2E8F0';

  // Form State
  const [neutral, setNeutral] = useState(0);
  const [pleasant, setPleasant] = useState(0);
  const [unpleasant, setUnpleasant] = useState(0);
  const [greetings, setGreetings] = useState(0);
  const [collaborations, setCollaborations] = useState(0);
  const [smiles, setSmiles] = useState(0);

  useEffect(() => {
    fetchAttentionData();
  }, [user]);

  const fetchAttentionData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const repo = getRepository();
      const records = await repo.getAttentionRecords();
      setHistory(records);
    } catch (error) {
      console.error("Error al cargar entrenamiento de atención:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-muted)' }}>
        Cargando entrenamiento de atención...
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const repo = getRepository();
      await repo.saveAttentionRecord({
        neutralConversations: neutral,
        pleasantConversations: pleasant,
        unpleasantConversations: unpleasant,
        greetingsObserved: greetings,
        collaborationsObserved: collaborations,
        smilesObserved: smiles
      });
      
      // Reset form
      setNeutral(0);
      setPleasant(0);
      setUnpleasant(0);
      setGreetings(0);
      setCollaborations(0);
      setSmiles(0);

      setStatusMessage('¡Registro atencional guardado con éxito!');
      setTimeout(() => setStatusMessage(null), 3000);

      // Refresh chart
      await fetchAttentionData();
    } catch (error) {
      console.error("Error al guardar registro atencional:", error);
    }
  };

  // Preparar datos del gráfico (Promedio de observaciones de los últimos 7 registros)
  const getChartData = () => {
    const lastRecords = [...history].slice(0, 7).reverse();
    const dates = lastRecords.map(r => new Date(r.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }));
    
    return {
      labels: dates.length > 0 ? dates : ['Sin datos'],
      datasets: [
        {
          label: 'Conversaciones Agradables',
          data: lastRecords.map(r => r.pleasantConversations),
          backgroundColor: '#22C55E', // verde
          borderRadius: 4
        },
        {
          label: 'Conversaciones Neutrales',
          data: lastRecords.map(r => r.neutralConversations),
          backgroundColor: '#3B82F6', // azul
          borderRadius: 4
        },
        {
          label: 'Conversaciones Desagradables',
          data: lastRecords.map(r => r.unpleasantConversations),
          backgroundColor: '#EF4444', // rojo suave en CSS
          borderRadius: 4
        },
        {
          label: 'Gestos Positivos (Sonrisas, Saludos, Colaboración)',
          data: lastRecords.map(r => r.smilesObserved + r.greetingsObserved + r.collaborationsObserved),
          backgroundColor: '#06B6D4', // cian
          borderRadius: 4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textSecondaryColor,
          boxWidth: 12,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        borderColor: tooltipBorder,
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        stacked: false,
        grid: { display: false },
        ticks: { color: tickColor }
      },
      y: {
        stacked: false,
        grid: { color: gridColor },
        ticks: { color: tickColor, precision: 0 }
      }
    }
  };

  const counterStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)'
  };

  const adjusterStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const iconStyle = {
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent-primary)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Explicación Terapéutica */}
      <div className="card fade-in" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)', flexShrink: 0 }}>
          <Info size={24} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h3 style={{ fontWeight: 600, fontSize: '1.05rem' }}>¿Por qué entrenar la atención?</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Nuestra mente tiende naturalmente a enfocarse en los estímulos negativos o amenazantes (un fenómeno conocido como <strong>sesgo de negatividad</strong>). Al registrar de forma activa las interacciones neutrales y positivas cotidianas, obligamos a nuestra atención a buscar un panorama más equilibrado de la realidad.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="alert alert-success fade-in">
          <CheckCircle2 size={18} />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="dashboard-grid">
        
        {/* Formulario de Observación */}
        <div className="card col-6 fade-in">
          <h2 className="card-title">
            <MessageSquare size={18} />
            Registro de Observación Diaria
          </h2>
          
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={counterStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={iconStyle}><MessageSquare size={16} /></div>
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block' }}>Conversaciones Neutrales</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Intercambios casuales sin carga emocional</span>
                </div>
              </div>
              <div style={adjusterStyle}>
                <button type="button" onClick={() => setNeutral(prev => Math.max(0, prev - 1))} className="btn btn-secondary" style={{ padding: '6px 12px' }}>-</button>
                <span style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{neutral}</span>
                <button type="button" onClick={() => setNeutral(prev => prev + 1)} className="btn btn-secondary" style={{ padding: '6px 12px' }}>+</button>
              </div>
            </div>

            <div style={counterStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ ...iconStyle, color: 'var(--accent-success)', backgroundColor: 'var(--accent-success-light)' }}><Smile size={16} /></div>
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block' }}>Conversaciones Agradables</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Charla fluida, risas o palabras amables</span>
                </div>
              </div>
              <div style={adjusterStyle}>
                <button type="button" onClick={() => setPleasant(prev => Math.max(0, prev - 1))} className="btn btn-secondary" style={{ padding: '6px 12px' }}>-</button>
                <span style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{pleasant}</span>
                <button type="button" onClick={() => setPleasant(prev => prev + 1)} className="btn btn-secondary" style={{ padding: '6px 12px' }}>+</button>
              </div>
            </div>

            <div style={counterStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ ...iconStyle, color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.08)' }}><Info size={16} /></div>
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block' }}>Conversaciones Desagradables</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Discusiones, tono tenso o malentendidos</span>
                </div>
              </div>
              <div style={adjusterStyle}>
                <button type="button" onClick={() => setUnpleasant(prev => Math.max(0, prev - 1))} className="btn btn-secondary" style={{ padding: '6px 12px' }}>-</button>
                <span style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{unpleasant}</span>
                <button type="button" onClick={() => setUnpleasant(prev => prev + 1)} className="btn btn-secondary" style={{ padding: '6px 12px' }}>+</button>
              </div>
            </div>

            <div style={counterStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={iconStyle}><Handshake size={16} /></div>
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block' }}>Saludos Observados</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Personas saludándose cordialmente</span>
                </div>
              </div>
              <div style={adjusterStyle}>
                <button type="button" onClick={() => setGreetings(prev => Math.max(0, prev - 1))} className="btn btn-secondary" style={{ padding: '6px 12px' }}>-</button>
                <span style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{greetings}</span>
                <button type="button" onClick={() => setGreetings(prev => prev + 1)} className="btn btn-secondary" style={{ padding: '6px 12px' }}>+</button>
              </div>
            </div>

            <div style={counterStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={iconStyle}><Users size={16} /></div>
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block' }}>Colaboraciones Activas</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Personas ayudándose o trabajando juntas</span>
                </div>
              </div>
              <div style={adjusterStyle}>
                <button type="button" onClick={() => setCollaborations(prev => Math.max(0, prev - 1))} className="btn btn-secondary" style={{ padding: '6px 12px' }}>-</button>
                <span style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{collaborations}</span>
                <button type="button" onClick={() => setCollaborations(prev => prev + 1)} className="btn btn-secondary" style={{ padding: '6px 12px' }}>+</button>
              </div>
            </div>

            <div style={counterStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ ...iconStyle, color: 'var(--accent-cyan)', backgroundColor: 'var(--accent-cyan-light)' }}><Smile size={16} /></div>
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block' }}>Personas Sonriendo</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gente con gestos faciales amigables</span>
                </div>
              </div>
              <div style={adjusterStyle}>
                <button type="button" onClick={() => setSmiles(prev => Math.max(0, prev - 1))} className="btn btn-secondary" style={{ padding: '6px 12px' }}>-</button>
                <span style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{smiles}</span>
                <button type="button" onClick={() => setSmiles(prev => prev + 1)} className="btn btn-secondary" style={{ padding: '6px 12px' }}>+</button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Guardar Observaciones
              <ArrowRight size={16} />
            </button>

          </form>
        </div>

        {/* Gráfico de Evolución */}
        <div className="card col-6 fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="card-title">
            <TrendingUp size={18} style={{ color: 'var(--accent-primary)' }} />
            Distribución de la Atención Reciente
          </h2>
          
          <div style={{ flex: 1, minHeight: '340px', position: 'relative', marginTop: '16px' }}>
            {history.length > 0 ? (
              <Bar data={getChartData()} options={chartOptions} />
            ) : (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', gap: '12px', textAlign: 'center', padding: '20px'
              }}>
                <TrendingUp size={40} strokeWidth={1.5} />
                <div>
                  <p style={{ fontWeight: 600 }}>Gráficos Automáticos</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '4px', maxWidth: '300px' }}>
                    Guarda tus observaciones diarias de hoy para comenzar a visualizar los gráficos de sesgo atencional.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default AttentionTraining;
