import React, { useEffect, useState } from 'react';
import { 
  HeartPulse, 
  ClipboardPen, 
  Brain, 
  Calendar, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { getRepository } from '../../services';
import type { CbtRecord, ExerciseSession } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MOTIVATIONAL_QUOTES = [
  "La curiosidad hacia uno mismo es el primer paso para la sanación. Observa tu mente con interés, no con juicio.",
  "Los pensamientos son solo interpretaciones de la realidad, no verdades absolutas. Cuestiónalos con amabilidad.",
  "No puedes detener las olas, pero puedes aprender a surfear. Tómate un respiro hoy.",
  "Tu atención es como un reflector. Elige iluminar lo que te nutre y te conecta con el presente.",
  "Acepta lo que sientes en este momento. Las emociones son como nubes: aparecen, cambian y eventualmente pasan.",
  "La reestructuración cognitiva no busca pensar en positivo de forma ciega, sino encontrar explicaciones realistas y equilibradas.",
  "Un momento de respiración consciente puede interrumpir una espiral de pensamientos automáticos."
];

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cbtRecords, setCbtRecords] = useState<CbtRecord[]>([]);
  const [exercises, setExercises] = useState<ExerciseSession[]>([]);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Escoger frase del día
    const dayIndex = new Date().getDay();
    setQuote(MOTIVATIONAL_QUOTES[dayIndex]);

    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const repo = getRepository();
        const records = await repo.getCbtRecords();
        const execs = await repo.getExerciseSessions();
        setCbtRecords(records);
        setExercises(execs);
      } catch (error) {
        console.error("Error al cargar datos del Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Cálculos estadísticos
  const totalRecords = cbtRecords.length;
  const totalExercises = exercises.length;
  
  const avgIntensity = totalRecords > 0
    ? Math.round(cbtRecords.reduce((acc, r) => acc + r.q5_intensity, 0) / totalRecords)
    : 0;

  // Streak (racha) simple
  const calculateStreak = (): number => {
    if (totalRecords === 0) return 0;
    
    const dates = cbtRecords
      .map(r => new Date(r.date).toDateString())
      .filter((value, index, self) => self.indexOf(value) === index) // fechas únicas
      .map(d => new Date(d));

    dates.sort((a, b) => b.getTime() - a.getTime()); // de más nueva a más vieja

    let streak = 0;
    let today = new Date();
    today.setHours(0,0,0,0);
    
    let currentCheck = new Date(today);
    
    // Si no hay registro hoy ni ayer, racha es 0
    const firstDate = dates[0];
    if (firstDate) {
      firstDate.setHours(0,0,0,0);
      const diffDays = Math.floor((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) return 0;
    } else {
      return 0;
    }

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      date.setHours(0,0,0,0);
      
      const diff = Math.floor((currentCheck.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 0) {
        streak++;
        // mover check a un día anterior
        currentCheck.setDate(currentCheck.getDate() - 1);
      } else if (diff === 1 && i === 0) {
        // Permitir que empiece desde ayer si hoy no se ha registrado aún
        streak++;
        currentCheck.setDate(currentCheck.getDate() - 2);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  // Gráfico semanal de intensidad emocional (últimos 7 días)
  const getWeeklyChartData = () => {
    const labels = [];
    const dataPoints = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      labels.push(date.toLocaleDateString('es-ES', { weekday: 'short' }));
      
      // Filtrar registros de este día específico
      const dayRecords = cbtRecords.filter(r => {
        const recDate = new Date(r.date);
        return recDate.toDateString() === date.toDateString();
      });

      if (dayRecords.length > 0) {
        const avg = dayRecords.reduce((acc, r) => acc + r.q5_intensity, 0) / dayRecords.length;
        dataPoints.push(Math.round(avg));
      } else {
        dataPoints.push(null); // No hay datos para ese día
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'Intensidad Emocional Promedio',
          data: dataPoints,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          tension: 0.35,
          fill: true,
          spanGaps: true,
          pointBackgroundColor: '#3B82F6',
          pointHoverRadius: 6,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'var(--bg-secondary)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border-color)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'var(--border-color)',
          drawTicks: false
        },
        ticks: {
          color: 'var(--text-muted)',
          font: { size: 10 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'var(--text-muted)',
          font: { size: 10 }
        }
      }
    }
  };

  // Progreso semanal: 0 a 5 registros por semana recomendado
  const getWeeklyProgress = () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Inicio del domingo
    startOfWeek.setHours(0,0,0,0);

    const thisWeekRecords = cbtRecords.filter(r => new Date(r.date).getTime() >= startOfWeek.getTime()).length;
    const goal = 5;
    const pct = Math.min(Math.round((thisWeekRecords / goal) * 100), 100);
    return { count: thisWeekRecords, goal, pct };
  };

  const progress = getWeeklyProgress();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-muted)' }}>
        Cargando panel de control...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Banner de Bienvenida y Frase */}
      <div className="card fade-in" style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-primary-light) 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
          <Sparkles size={18} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Reflexión Diaria</span>
        </div>
        <p style={{ 
          fontSize: '1.15rem', 
          fontStyle: 'italic', 
          lineHeight: '1.6', 
          color: 'var(--text-primary)',
          fontWeight: 500
        }}>
          "{quote}"
        </p>
      </div>

      {/* Grid de KPIs */}
      <div className="kpi-container">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: 'var(--accent-primary-light)', color: 'var(--accent-primary)' }}>
            <ClipboardPen size={20} />
          </div>
          <div>
            <p className="kpi-value">{totalRecords}</p>
            <p className="kpi-label">Registros TCC</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ 
            backgroundColor: avgIntensity > 70 ? 'rgba(245, 158, 11, 0.1)' : 'var(--accent-success-light)', 
            color: avgIntensity > 70 ? 'var(--accent-warning)' : 'var(--accent-success)' 
          }}>
            <HeartPulse size={20} />
          </div>
          <div>
            <p className="kpi-value">{avgIntensity}%</p>
            <p className="kpi-label">Malestar Promedio</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)' }}>
            <Brain size={20} />
          </div>
          <div>
            <p className="kpi-value">{totalExercises}</p>
            <p className="kpi-label">Ejercicios Hechos</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: 'var(--accent-primary-light)', color: 'var(--accent-primary)' }}>
            <Calendar size={20} />
          </div>
          <div>
            <p className="kpi-value">{streak} {streak === 1 ? 'día' : 'días'}</p>
            <p className="kpi-label">Racha Diaria</p>
          </div>
        </div>
      </div>

      {/* Gráfico y Progreso */}
      <div className="dashboard-grid">
        <div className="card col-8" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <h2 className="card-title">
            <TrendingUp size={18} style={{ color: 'var(--accent-primary)' }} />
            Evolución de Intensidad Emocional Semanal
          </h2>
          <div style={{ flex: 1, minHeight: '260px', position: 'relative' }}>
            {totalRecords > 0 ? (
              <Line data={getWeeklyChartData()} options={chartOptions} />
            ) : (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', gap: '8px'
              }}>
                <ClipboardPen size={32} strokeWidth={1.5} />
                <span>No hay suficientes registros esta semana.</span>
                <button 
                  onClick={() => onNavigate('/nuevo-registro')}
                  className="btn btn-text" 
                  style={{ color: 'var(--accent-primary)', cursor: 'pointer', padding: 4, background: 'none', border: 'none', fontWeight: 600 }}
                >
                  Crea tu primer registro
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card col-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 className="card-title" style={{ marginBottom: '8px' }}>Progreso Semanal</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Meta: registrar 5 pensamientos por semana para fortalecer el autoconocimiento.</span>
          </div>

          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
              <span>{progress.count} de {progress.goal} registros</span>
              <span>{progress.pct}%</span>
            </div>
            <div style={{
              height: '8px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress.pct}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)',
                borderRadius: '4px',
                transition: 'width 0.5s ease-in-out'
              }} />
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Acciones Recomendadas</h3>
            
            <button 
              onClick={() => onNavigate('/nuevo-registro')}
              className="btn btn-primary"
              style={{ justifyContent: 'space-between', width: '100%' }}
            >
              <span>Nuevo Registro de TCC</span>
              <ArrowRight size={16} />
            </button>

            <button 
              onClick={() => onNavigate('/ejercicios')}
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', width: '100%' }}
            >
              <span>Hacer Ejercicio Relajante</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Historial Reciente */}
      <div className="card">
        <h2 className="card-title">Último Registro Analizado</h2>
        {cbtRecords.length > 0 ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Registrado el {new Date(cbtRecords[0].date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span style={{ 
                fontWeight: 600, 
                color: cbtRecords[0].q5_intensity > 70 ? 'var(--accent-warning)' : 'var(--accent-success)' 
              }}>
                Intensidad: {cbtRecords[0].q5_intensity}%
              </span>
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px' }}>Situación:</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{cbtRecords[0].q1_whatHappened}</p>
            
            <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px' }}>Pensamiento Automático:</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>"{cbtRecords[0].q3_automaticThought}"</p>
            
            <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px' }}>Explicación Alternativa / Equilibrada:</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{cbtRecords[0].q9_balancedExplanation}</p>

            <button 
              onClick={() => onNavigate('/historial')}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              Ver Historial Completo
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: 'var(--text-muted)', gap: '12px' }}>
            <p style={{ fontSize: '0.9rem' }}>Aún no has registrado ningún pensamiento automático.</p>
            <button 
              onClick={() => onNavigate('/nuevo-registro')}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              Comenzar Primer Registro
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
export default Dashboard;
