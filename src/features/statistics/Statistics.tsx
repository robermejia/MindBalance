import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  Heart, 
  CheckCircle2, 
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { getRepository } from '../../services';
import type { CbtRecord, ExerciseSession } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { Line, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  ChartLegend,
  ArcElement
);

type EmotionKey = 'ansiedad' | 'miedo' | 'tristeza' | 'molestia' | 'verguenza' | 'enojo';

export const Statistics: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cbtRecords, setCbtRecords] = useState<CbtRecord[]>([]);
  const [exercises, setExercises] = useState<ExerciseSession[]>([]);

  useEffect(() => {
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
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Cálculos estadísticos generales
  const totalRecords = cbtRecords.length;
  const totalExercises = exercises.length;

  const totalTimeSeconds = exercises.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalTimeMins = Math.round(totalTimeSeconds / 60);

  // Frecuencia de Emociones (Promedio general de cada emoción)
  const getAverageEmotions = (): Record<EmotionKey, number> => {
    const result: Record<EmotionKey, number> = {
      ansiedad: 0,
      miedo: 0,
      tristeza: 0,
      molestia: 0,
      verguenza: 0,
      enojo: 0
    };

    if (totalRecords === 0) return result;

    cbtRecords.forEach(r => {
      (Object.keys(result) as EmotionKey[]).forEach(k => {
        result[k] += r.q4_emotions[k] || 0;
      });
    });

    (Object.keys(result) as EmotionKey[]).forEach(k => {
      result[k] = Math.round(result[k] / totalRecords);
    });

    return result;
  };

  const avgEmotions = getAverageEmotions();

  // Encontrar las emociones más frecuentes (las de mayor promedio)
  const getMostFrequentEmotions = () => {
    return Object.entries(avgEmotions)
      .sort((a, b) => b[1] - a[1])
      .filter(item => item[1] > 0)
      .slice(0, 3);
  };

  const frequentEmotions = getMostFrequentEmotions();

  // Pensamientos/Distorsiones frecuentes simulados basándose en palabras clave
  const getCommonThoughts = () => {
    if (totalRecords === 0) return [];
    
    // Contar ocurrencias simples de patrones comunes de distorsiones
    const distorsiones = [
      { name: 'Catastrofismo (Adivinar el futuro)', keywords: ['despedir', 'morir', 'peor', 'fallar', 'ruina', 'nunca', 'siempre'] },
      { name: 'Lectura de Pensamiento', keywords: ['piensa', 'creen', 'dijeron', 'ignora', 'deliberadamente', 'caigo mal'] },
      { name: 'Personalización', keywords: ['mi culpa', 'por mí', 'conmigo', 'hacia mí', 'personal'] },
      { name: 'Pensamiento Todo o Nada', keywords: ['incompetente', 'tontería', 'fracaso', 'perfecto', 'nada', 'todo'] }
    ];

    const counts = distorsiones.map(d => {
      let count = 0;
      cbtRecords.forEach(r => {
        const text = (r.q3_automaticThought + ' ' + r.q1_whatHappened).toLowerCase();
        d.keywords.forEach(w => {
          if (text.includes(w)) count++;
        });
      });
      return { name: d.name, count };
    });

    return counts.sort((a, b) => b.count - a.count).filter(c => c.count > 0);
  };

  const commonThoughts = getCommonThoughts();

  // Gráfico 1: Radar de Distribución de Emociones
  const getRadarData = () => {
    return {
      labels: ['Ansiedad', 'Miedo', 'Tristeza', 'Molestia', 'Vergüenza', 'Enojo'],
      datasets: [
        {
          label: 'Intensidad Promedio %',
          data: [
            avgEmotions.ansiedad,
            avgEmotions.miedo,
            avgEmotions.tristeza,
            avgEmotions.molestia,
            avgEmotions.verguenza,
            avgEmotions.enojo
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.18)',
          borderColor: '#3B82F6',
          borderWidth: 2,
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#3B82F6'
        }
      ]
    };
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      r: {
        angleLines: { color: 'var(--border-color)' },
        grid: { color: 'var(--border-color)' },
        pointLabels: {
          color: 'var(--text-secondary)',
          font: { size: 12, weight: 'bold' as const }
        },
        ticks: {
          backdropColor: 'transparent',
          color: 'var(--text-muted)',
          showLabelBackdrop: false
        },
        min: 0,
        max: 100
      }
    }
  };

  // Gráfico 2: Evolución Mensual del Malestar (Agrupado por día de ocurrencia de registros)
  const getLineData = () => {
    const sorted = [...cbtRecords].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const labels = sorted.map(r => new Date(r.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }));
    
    return {
      labels: labels.length > 0 ? labels : ['Sin datos'],
      datasets: [
        {
          label: 'Malestar Global',
          data: sorted.map(r => r.q5_intensity),
          borderColor: '#06B6D4', // cian
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          fill: true,
          tension: 0.25,
          pointBackgroundColor: '#06B6D4'
        }
      ]
    };
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'var(--bg-secondary)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border-color)',
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-muted)' }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'var(--border-color)' },
        ticks: { color: 'var(--text-muted)' }
      }
    }
  };

  // Gráfico 3: Distribución de Ejercicios Realizados
  const getDoughnutData = () => {
    const counts: Record<string, number> = {};
    exercises.forEach(s => {
      counts[s.exerciseName] = (counts[s.exerciseName] || 0) + 1;
    });

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            '#3B82F6', // azul
            '#22C55E', // verde
            '#06B6D4', // cian
            '#8B5CF6', // morado
            '#EC4899', // rosa
            '#F59E0B'  // naranja
          ],
          borderWidth: 1,
          borderColor: 'var(--bg-secondary)'
        }
      ]
    };
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'var(--text-secondary)',
          boxWidth: 10,
          font: { size: 10 }
        }
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-muted)' }}>
        Cargando estadísticas...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* KPIs Rápidos */}
      <div className="kpi-container">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: 'var(--accent-primary-light)', color: 'var(--accent-primary)' }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="kpi-value">{totalRecords}</p>
            <p className="kpi-label">Registros Guardados</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)' }}>
            <Clock size={20} />
          </div>
          <div>
            <p className="kpi-value">{totalTimeMins} min</p>
            <p className="kpi-label">Tiempo de Ejercicios</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: 'var(--accent-success-light)', color: 'var(--accent-success)' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="kpi-value">{totalExercises}</p>
            <p className="kpi-label">Ejercicios Realizados</p>
          </div>
        </div>
      </div>

      {/* Gráficos de Malestar y Frecuencias */}
      <div className="dashboard-grid">
        
        {/* Gráfico 1: Evolución del Malestar */}
        <div className="card col-8" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
          <h2 className="card-title">
            <TrendingUp size={18} style={{ color: 'var(--accent-cyan)' }} />
            Progreso Histórico del Malestar
          </h2>
          <div style={{ flex: 1, minHeight: '250px', position: 'relative' }}>
            {totalRecords > 0 ? (
              <Line data={getLineData()} options={lineOptions} />
            ) : (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
              }}>
                Aún no has registrado pensamientos para graficar.
              </div>
            )}
          </div>
        </div>

        {/* Resumen Frecuencias */}
        <div className="card col-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 className="card-title">
            <Heart size={18} style={{ color: '#EF4444' }} />
            Perfil de Afecto
          </h2>

          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>Emociones más Recurrentes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {frequentEmotions.length > 0 ? (
                frequentEmotions.map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize', fontSize: '0.9rem' }}>{key}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, marginLeft: '12px' }}>
                      <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', flex: 1, overflow: 'hidden' }}>
                        <div style={{ width: `${val}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }} />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '35px', textAlign: 'right' }}>{val}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sin datos de emociones.</span>
              )}
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }} />

          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              <BrainCircuit size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Distorsiones Sugeridas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {commonThoughts.length > 0 ? (
                commonThoughts.slice(0, 3).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{item.count} {item.count === 1 ? 'vez' : 'veces'}</span>
                  </div>
                ))
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No se detectaron patrones de distorsión frecuentes.</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Gráficos de Radar y Doughnut */}
      <div className="dashboard-grid">
        
        {/* Gráfico 2: Radar de Distribución Emocional */}
        <div className="card col-6" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
          <h2 className="card-title">
            <Heart size={18} style={{ color: 'var(--accent-primary)' }} />
            Distribución Emocional Global
          </h2>
          <div style={{ flex: 1, minHeight: '260px', position: 'relative' }}>
            {totalRecords > 0 ? (
              <Radar data={getRadarData()} options={radarOptions} />
            ) : (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
              }}>
                Agrega registros para ver la dispersión de tus emociones.
              </div>
            )}
          </div>
        </div>

        {/* Gráfico 3: Distribución de Ejercicios */}
        <div className="card col-6" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
          <h2 className="card-title">
            <CheckCircle2 size={18} style={{ color: 'var(--accent-success)' }} />
            Distribución de Ejercicios Practicados
          </h2>
          <div style={{ flex: 1, minHeight: '260px', position: 'relative' }}>
            {totalExercises > 0 ? (
              <Doughnut data={getDoughnutData()} options={doughnutOptions} />
            ) : (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
              }}>
                Comienza un ejercicio para ver tus porcentajes de uso.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default Statistics;
