import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Brain, 
  Eye, 
  Heart, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Compass, 
  Sparkles,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';
import { getRepository } from '../../services';

interface Exercise {
  id: string;
  name: string;
  objective: string;
  duration: string;
  durationSeconds: number;
  benefits: string[];
  howTo: string[];
  icon: any;
  color: string;
}

const EXERCISES_LIST: Exercise[] = [
  {
    id: 'respiracion',
    name: 'Respiración Consciente (Caja)',
    objective: 'Estabilizar el sistema nervioso autónomo y reducir el malestar físico agudo.',
    duration: '2 - 5 minutos',
    durationSeconds: 120,
    benefits: [
      'Disminuye la frecuencia cardíaca de inmediato.',
      'Rompe el ciclo automático de la hiperventilación por ansiedad.',
      'Sintoniza la atención en las sensaciones físicas del presente.'
    ],
    howTo: [
      'Inhala aire por la nariz durante 4 segundos.',
      'Retén el aire en tus pulmones durante 4 segundos.',
      'Exhala suavemente por la boca durante 4 segundos.',
      'Mantén tus pulmones vacíos durante 4 segundos.',
      'Repite el ciclo de forma rítmica.'
    ],
    icon: Wind,
    color: 'var(--accent-cyan)'
  },
  {
    id: 'hechos',
    name: 'Hechos vs Interpretaciones',
    objective: 'Aprender a discernir entre la realidad objetiva y las conclusiones subjetivas de la mente.',
    duration: '5 - 10 minutos',
    durationSeconds: 300,
    benefits: [
      'Reduce la reactividad ante eventos sociales.',
      'Desactiva el pensamiento catastrofista.',
      'Fomenta el escepticismo saludable hacia los propios pensamientos automáticos.'
    ],
    howTo: [
      'Escribe una situación estresante reciente.',
      'Divide la situación en "Hechos" (lo que se puede verificar científicamente).',
      'Identifica tus "Interpretaciones" (tus suposiciones, juicios y temores).',
      'Compara ambos lados para ganar perspectiva.'
    ],
    icon: Compass,
    color: 'var(--accent-primary)'
  },
  {
    id: 'gratitud',
    name: 'Diario de Gratitud Equilibrado',
    objective: 'Reentrenar el sesgo de atención hacia las experiencias positivas cotidianas.',
    duration: '3 minutos',
    durationSeconds: 180,
    benefits: [
      'Promueve la liberación de dopamina y serotonina.',
      'Contrarresta el sesgo de negatividad automático.',
      'Ayuda a cerrar el día con una sensación de seguridad.'
    ],
    howTo: [
      'Escribe tres detalles específicos que agradeces del día de hoy.',
      'No tienen que ser grandes eventos (por ejemplo, el olor del café, una sonrisa, una ducha tibia).',
      'Reflexiona brevemente sobre por qué ocurrió cada uno.'
    ],
    icon: Heart,
    color: 'var(--accent-success)'
  },
  {
    id: 'escaneo',
    name: 'Escaneo del Entorno (5-4-3-2-1)',
    objective: 'Desviar la atención de las espirales de pensamientos y anclarse en los sentidos físicos.',
    duration: '3 - 5 minutos',
    durationSeconds: 240,
    benefits: [
      'Excelente para detener ataques de pánico o desrealización.',
      'Calma la mente hiperactiva de forma inmediata.',
      'Reconecta tu conciencia con el espacio físico que te rodea.'
    ],
    howTo: [
      'Observa 5 objetos a tu alrededor.',
      'Siente 4 sensaciones físicas táctiles (el roce de tu ropa, el suelo en tus pies).',
      'Escucha 3 sonidos distintos de tu entorno.',
      'Identifica 2 olores en el aire.',
      'Nombra 1 cualidad o aspecto positivo de ti mismo en el presente.'
    ],
    icon: Eye,
    color: '#8B5CF6'
  },
  {
    id: 'pensamiento_alt',
    name: 'Pensamiento Alternativo',
    objective: 'Practicar la flexibilidad mental generando explicaciones distintas a la primera reacción.',
    duration: '5 minutos',
    durationSeconds: 300,
    benefits: [
      'Flexibiliza los esquemas cognitivos rígidos.',
      'Genera salidas constructivas a problemas complejos.',
      'Disminuye la intensidad emocional de la molestia o el enojo.'
    ],
    howTo: [
      'Anota un pensamiento rígido ("Nadie me apoya").',
      'Pregúntate: ¿Qué explicaciones alternativas ignoré en ese momento?',
      'Redacta tres alternativas factibles y realistas para la misma situación.'
    ],
    icon: Brain,
    color: '#EC4899'
  },
  {
    id: 'reenfoque',
    name: 'Reenfoque Cognitivo',
    objective: 'Cambiar el foco atencional de problemas insolubles a acciones controlables en el presente.',
    duration: '5 minutos',
    durationSeconds: 300,
    benefits: [
      'Reduce la rumiación improductiva.',
      'Restaura el sentido de autoeficacia y control.',
      'Promueve la resolución proactiva de problemas.'
    ],
    howTo: [
      'Define qué parte del problema está fuera de tu control.',
      'Define qué pequeña acción sí está bajo tu control inmediato.',
      'Desvía tu energía hacia esa acción controlable ahora mismo.'
    ],
    icon: RefreshCw,
    color: '#F59E0B'
  }
];

export const Exercises: React.FC = () => {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  // 1. Estados específicos para Respiración
  const [breathState, setBreathState] = useState<'Inhalar' | 'Retener' | 'Exhalar' | 'Mantener Vacío'>('Inhalar');
  const [breathTimer, setBreathTimer] = useState(4);
  const [exerciseTimer, setExerciseTimer] = useState(120);

  // 2. Estados específicos para Gratitud
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');

  // 3. Estados específicos para Hechos vs Interpretaciones
  const [situation, setSituation] = useState('');
  const [facts, setFacts] = useState<string[]>(['']);
  const [interpretations, setInterpretations] = useState<string[]>(['']);

  // 4. Estados específicos para Escaneo 5-4-3-2-1
  const [groundingStep, setGroundingStep] = useState(5); // va de 5 a 1
  const [groundingInputs, setGroundingInputs] = useState<string[]>([]);
  const [currentGroundingInput, setCurrentGroundingInput] = useState('');

  // Efecto para el temporizador global de los ejercicios
  useEffect(() => {
    let interval: any = null;
    if (sessionActive && exerciseTimer > 0) {
      interval = setInterval(() => {
        setExerciseTimer(prev => prev - 1);
      }, 1000);
    } else if (exerciseTimer === 0 && sessionActive) {
      handleCompleteSession();
    }
    return () => clearInterval(interval);
  }, [sessionActive, exerciseTimer]);

  // Efecto exclusivo para Respiración
  useEffect(() => {
    let breathInterval: any = null;
    if (sessionActive && activeExercise?.id === 'respiracion') {
      breathInterval = setInterval(() => {
        setBreathTimer(prev => {
          if (prev === 1) {
            // Cambiar fase de respiración
            setBreathState(state => {
              switch (state) {
                case 'Inhalar': return 'Retener';
                case 'Retener': return 'Exhalar';
                case 'Exhalar': return 'Mantener Vacío';
                case 'Mantener Vacío': return 'Inhalar';
                default: return 'Inhalar';
              }
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(breathInterval);
  }, [sessionActive, activeExercise]);

  const handleStartSession = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setExerciseTimer(exercise.durationSeconds);
    setSessionActive(true);
    setSuccessSaved(false);
    
    // Resetear sub-estados
    setBreathState('Inhalar');
    setBreathTimer(4);
    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    setSituation('');
    setFacts(['']);
    setInterpretations(['']);
    setGroundingStep(5);
    setGroundingInputs([]);
    setCurrentGroundingInput('');
  };

  const handleCompleteSession = async (customNotes?: string) => {
    setSessionActive(false);
    try {
      const repo = getRepository();
      
      let notes = customNotes || 'Ejercicio completado con éxito.';
      if (activeExercise?.id === 'gratitud') {
        notes = `Agradecimientos: \n1. ${gratitude1}\n2. ${gratitude2}\n3. ${gratitude3}`;
      } else if (activeExercise?.id === 'hechos') {
        notes = `Situación: ${situation}\nHechos: ${facts.join(', ')}\nInterpretaciones: ${interpretations.join(', ')}`;
      } else if (activeExercise?.id === 'escaneo') {
        notes = `Escaneo 5-4-3-2-1 completado. Elementos registrados:\n${groundingInputs.join('\n')}`;
      }

      await repo.saveExerciseSession({
        exerciseId: activeExercise!.id,
        exerciseName: activeExercise!.name,
        durationSeconds: activeExercise!.durationSeconds - exerciseTimer,
        notes
      });
      setSuccessSaved(true);
    } catch (error) {
      console.error("Error al guardar sesión de ejercicio:", error);
    }
  };

  // Ayudantes dinámicos para dinámicas de formularios de ejercicios
  const handleAddFact = () => setFacts(prev => [...prev, '']);
  const handleAddInterpretation = () => setInterpretations(prev => [...prev, '']);
  
  const handleGroundingSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGroundingInput.trim()) return;

    setGroundingInputs(prev => [...prev, `${groundingStep} - ${currentGroundingInput}`]);
    setCurrentGroundingInput('');
    
    if (groundingStep > 1) {
      setGroundingStep(prev => prev - 1);
    } else {
      // Finalizó el escaneo
      handleCompleteSession();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Renderizar la guía interactiva específica
  const renderInteractiveGuide = () => {
    if (!activeExercise) return null;

    switch (activeExercise.id) {
      case 'respiracion':
        // Círculo interactivo que se expande/contrae
        const isExpanding = breathState === 'Inhalar';
        const isContracting = breathState === 'Exhalar';
        const scaleVal = isExpanding ? 1.25 : (isContracting ? 0.9 : 1.1);
        
        return (
          <div className="breathing-box">
            <div className="breathing-state-text">{breathState}</div>
            
            <div className="breathing-circle-outer">
              <div 
                className="breathing-circle-inner"
                style={{ 
                  transform: `scale(${scaleVal})`,
                  backgroundColor: breathState === 'Retener' ? 'rgba(59, 130, 246, 0.2)' : 'var(--accent-cyan-light)',
                  transition: 'transform 4s linear'
                }}
              >
                <span style={{ fontSize: '2rem', fontWeight: 700 }}>{breathTimer}s</span>
              </div>
            </div>
            
            <div className="breathing-timer">
              Tiempo Restante: {formatTimer(exerciseTimer)}
            </div>
            <button 
              onClick={() => handleCompleteSession('Sesión finalizada manualmente por el usuario.')}
              className="btn btn-secondary" 
              style={{ marginTop: '24px' }}
            >
              Terminar Ejercicio
            </button>
          </div>
        );

      case 'gratitud':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Escribe tres cosas simples por las cuales te sientes agradecido hoy:</p>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="1. Ejemplo: El aroma de mi café esta mañana."
                value={gratitude1} 
                onChange={(e) => setGratitude1(e.target.value)} 
                className="form-input" 
                style={{ marginBottom: '12px' }}
              />
              <input 
                type="text" 
                placeholder="2. Ejemplo: Una conversación corta con un amigo."
                value={gratitude2} 
                onChange={(e) => setGratitude2(e.target.value)} 
                className="form-input" 
                style={{ marginBottom: '12px' }}
              />
              <input 
                type="text" 
                placeholder="3. Ejemplo: El clima soleado de la tarde."
                value={gratitude3} 
                onChange={(e) => setGratitude3(e.target.value)} 
                className="form-input"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button onClick={() => setActiveExercise(null)} className="btn btn-secondary">Cancelar</button>
              <button 
                onClick={() => handleCompleteSession()} 
                disabled={!gratitude1.trim() || !gratitude2.trim() || !gratitude3.trim()}
                className="btn btn-primary"
              >
                Guardar Gratitud
              </button>
            </div>
          </div>
        );

      case 'hechos':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Describe la situación actual o estresante:</label>
              <textarea 
                value={situation} 
                onChange={(e) => setSituation(e.target.value)} 
                className="form-textarea" 
                placeholder="Ejemplo: Mi compañero me habló de mala manera al entrar..."
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ color: 'var(--accent-success)' }}>Hechos Objetivos (Evidencia real)</label>
                {facts.map((fact, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={fact}
                    onChange={(e) => {
                      const c = [...facts];
                      c[idx] = e.target.value;
                      setFacts(c);
                    }}
                    className="form-input"
                    placeholder="Solo hechos medibles..."
                    style={{ marginBottom: '8px' }}
                  />
                ))}
                <button onClick={handleAddFact} className="btn btn-text" style={{ fontSize: '0.8rem', padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', fontWeight: 600 }}>+ Añadir Hecho</button>
              </div>

              <div>
                <label className="form-label" style={{ color: 'var(--accent-warning)' }}>Mis Interpretaciones (Juicios)</label>
                {interpretations.map((interp, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={interp}
                    onChange={(e) => {
                      const c = [...interpretations];
                      c[idx] = e.target.value;
                      setInterpretations(c);
                    }}
                    className="form-input"
                    placeholder="Mis opiniones, suposiciones..."
                    style={{ marginBottom: '8px' }}
                  />
                ))}
                <button onClick={handleAddInterpretation} className="btn btn-text" style={{ fontSize: '0.8rem', padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', fontWeight: 600 }}>+ Añadir Interpretación</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button onClick={() => setActiveExercise(null)} className="btn btn-secondary">Cancelar</button>
              <button 
                onClick={() => handleCompleteSession()} 
                disabled={!situation.trim()}
                className="btn btn-primary"
              >
                Guardar Comparación
              </button>
            </div>
          </div>
        );

      case 'escaneo':
        const stepsInstructions: Record<number, { text: string; placeholder: string }> = {
          5: { text: 'Nombra 5 cosas que puedas VER a tu alrededor ahora mismo:', placeholder: 'Ej. Una taza azul, una ventana...' },
          4: { text: 'Nombra 4 cosas físicas que puedas SENTIR (tacto):', placeholder: 'Ej. El roce de mi pantalón, la silla de madera...' },
          3: { text: 'Nombra 3 cosas que puedas ESCUCHAR (sonidos):', placeholder: 'Ej. El ventilador, un coche pasar, un pájaro...' },
          2: { text: 'Nombra 2 cosas que puedas OLER en tu ambiente:', placeholder: 'Ej. El olor de mi café, el suavizante...' },
          1: { text: 'Nombra 1 aspecto o CUALIDAD positiva de ti mismo:', placeholder: 'Ej. Soy paciente, me cuido a mí mismo...' }
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
              <Sparkles size={18} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Paso del Escaneo: {groundingStep}</span>
            </div>

            <p style={{ fontWeight: 500, fontSize: '1rem' }}>{stepsInstructions[groundingStep].text}</p>
            
            <form onSubmit={handleGroundingSubmitInput} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={currentGroundingInput}
                onChange={(e) => setCurrentGroundingInput(e.target.value)}
                placeholder={stepsInstructions[groundingStep].placeholder}
                className="form-input"
                required
              />
              <button type="submit" className="btn btn-primary">Registrar</button>
            </form>

            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Elementos capturados:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {groundingInputs.map((val, idx) => (
                  <span key={idx} style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>{val}</span>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button onClick={() => setActiveExercise(null)} className="btn btn-secondary">Cancelar</button>
            </div>
          </div>
        );

      default:
        // Ejercicio genérico con temporizador de cuenta regresiva
        return (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <h3 style={{ marginBottom: '12px' }}>{activeExercise.name} en Progreso</h3>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '24px' }}>
              {formatTimer(exerciseTimer)}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
              Sigue las instrucciones descritas en la tarjeta del ejercicio para completar la actividad. El temporizador te avisará cuando termine.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setSessionActive(!sessionActive)} className="btn btn-secondary">
                {sessionActive ? <Pause size={16} /> : <Play size={16} />}
                {sessionActive ? 'Pausar' : 'Reanudar'}
              </button>
              <button onClick={() => handleCompleteSession()} className="btn btn-primary">
                Terminar y Registrar
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {successSaved && (
        <div className="alert alert-success fade-in">
          <CheckCircle2 size={18} />
          <span>¡Sesión de ejercicio registrada y guardada con éxito en tu historial de progreso!</span>
        </div>
      )}

      {/* Visor de Ejercicio Activo */}
      {activeExercise && (
        <div className="card fade-in" style={{ 
          borderColor: 'var(--accent-primary)', 
          background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
          borderWidth: '2px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="card-title" style={{ margin: 0 }}>
              {React.createElement(activeExercise.icon, { size: 22, style: { color: activeExercise.color } })}
              {activeExercise.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Clock size={14} />
              <span>{activeExercise.duration}</span>
            </div>
          </div>

          <div style={{ 
            padding: '24px', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-light)'
          }}>
            {renderInteractiveGuide()}
          </div>
        </div>
      )}

      {/* Catálogo de Ejercicios */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '8px' }}>Catálogo de Ejercicios TCC</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '24px' 
      }}>
        {EXERCISES_LIST.map((ex) => {
          const Icon = ex.icon;
          return (
            <div key={ex.id} className="card fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ex.color
                  }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    <span>{ex.duration}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>{ex.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>{ex.objective}</p>
                
                <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Beneficios:</h4>
                <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                  {ex.benefits.slice(0, 2).map((b, idx) => (
                    <li key={idx} style={{ lineHeight: '1.3' }}>{b}</li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handleStartSession(ex)}
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.85rem', padding: '10px' }}
              >
                <span>Comenzar Ejercicio</span>
                <ChevronRight size={16} />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
export default Exercises;
