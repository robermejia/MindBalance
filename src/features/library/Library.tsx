import React, { useState } from 'react';
import { 
  HelpCircle, 
  BrainCircuit, 
  Compass, 
  HeartPulse, 
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  icon: any;
  color: string;
}

const ARTICLES_LIST: Article[] = [
  {
    id: 'pensamientos_aut',
    title: '¿Qué son los pensamientos automáticos?',
    excerpt: 'Son ideas breves y rápidas que cruzan por nuestra mente como reacciones automáticas a los eventos externos o internos.',
    icon: HelpCircle,
    color: 'var(--accent-primary)',
    content: [
      'Los pensamientos automáticos son como "correos electrónicos instantáneos" que nuestra mente envía de forma inconsciente a lo largo del día. A menudo aparecen en forma de palabras breves, imágenes o frases condensadas.',
      'No se originan mediante una deliberación racional. Al contrario, son el resultado de la forma en que nuestro cerebro ha aprendido a interpretar las situaciones a lo largo de nuestra historia personal.',
      'Un aspecto clave es que suelen sentirse enteramente verdaderos en el momento en que ocurren. Si un compañero frunce el ceño y pensamos "está molesto conmigo", tendemos a creerlo sin buscar pruebas.',
      'La TCC enseña que no podemos impedir que estos pensamientos broten, pero sí podemos aprender a identificarlos, pausar y evaluar si realmente reflejan la verdad objetiva.'
    ]
  },
  {
    id: 'sesgo_atencional',
    title: '¿Qué es el sesgo atencional?',
    excerpt: 'Es la tendencia de nuestro sistema perceptivo a priorizar unos estímulos sobre otros, a menudo enfocándose en lo negativo o amenazante.',
    icon: Compass,
    color: 'var(--accent-cyan)',
    content: [
      'El sesgo atencional es el "filtro" o la "lente" con la que nuestra mente escanea el entorno. Por diseño evolutivo, nuestro cerebro está programado para detectar amenazas rápidamente (sesgo de negatividad) para mantenernos con vida.',
      'Sin embargo, en el mundo moderno, este filtro puede sobre-reaccionar. Si entramos a un salón con 10 personas y 9 sonríen pero 1 tiene cara seria, nuestra atención se clavará casi exclusivamente en la persona seria.',
      'Esto crea la ilusión de que el ambiente es hostil o peligroso. Al registrar activamente interacciones neutrales o agradables en MindBalance, entrenamos conscientemente el reflector de nuestra atención para capturar un panorama más balanceado de la realidad.',
      'No se trata de ignorar los problemas, sino de darles a los aspectos positivos y cotidianos el peso proporcional que merecen.'
    ]
  },
  {
    id: 'reestructuracion',
    title: '¿Qué es la reestructuración cognitiva?',
    excerpt: 'Es el proceso terapéutico de identificar pensamientos desadaptativos y reformularlos hacia versiones más racionales y equilibradas.',
    icon: BrainCircuit,
    color: '#8B5CF6',
    content: [
      'La reestructuración cognitiva es una de las técnicas centrales de la Terapia Cognitivo-Conductual. Consiste en aprender a "discutir amablemente" con nuestros propios pensamientos automáticos.',
      'El proceso no consiste en "pensar positivo" ni en engañarse a uno mismo. Consiste en actuar como científicos: reunir evidencia a favor, evidencia en contra y considerar explicaciones alternativas.',
      'Cuando hacemos esto, solemos darnos cuenta de que nuestros pensamientos automáticos exageran la negatividad o asumen catástrofes improbables.',
      'El resultado final es una explicación más equilibrada que, si bien acepta las dificultades de la situación, elimina el sufrimiento innecesario derivado de interpretaciones inexactas.'
    ]
  },
  {
    id: 'distorsiones',
    title: '¿Qué son las distorsiones cognitivas?',
    excerpt: 'Son hábitos de procesamiento de información sesgados que nos llevan a interpretar la realidad de manera distorsionada o inexacta.',
    icon: BrainCircuit,
    color: '#EC4899',
    content: [
      'Las distorsiones cognitivas son los "trucos o fallos de lógica" en los que cae nuestro cerebro con frecuencia. Son atajos mentales que simplifican la realidad de forma perjudicial.',
      'Algunos ejemplos muy comunes son:',
      '• Catastrofismo: Imaginar siempre el peor escenario posible (ej. "si cometo un error en la presentación, me despedirán y quedaré en la calle").',
      '• Lectura de pensamiento: Asumir que sabemos lo que los demás están pensando de nosotros sin preguntarles (ej. "se quedó callado porque piensa que soy un incompetente").',
      '• Pensamiento todo o nada (Blanco o Negro): Ver las cosas en categorías extremas. Si no somos perfectos, entonces somos un fracaso absoluto.',
      'Identificar estas distorsiones en tus registros de pensamientos automáticos es el primer paso para desactivar su impacto emocional.'
    ]
  },
  {
    id: 'ansiedad_func',
    title: '¿Cómo funciona la ansiedad?',
    excerpt: 'Una mirada científica a la respuesta natural de supervivencia de nuestro organismo ante el peligro percibido.',
    icon: HeartPulse,
    color: '#EF4444',
    content: [
      'La ansiedad no es una enfermedad ni un fallo de carácter; es un sistema de alarma natural y vital diseñado para protegernos.',
      'Cuando percibimos una amenaza (ya sea real como un depredador, o mental como la preocupación por un examen), el cerebro activa la respuesta de "lucha, huida o congelamiento". Esto libera adrenalina y cortisol en el cuerpo.',
      'Esta liberación física causa palpitaciones, respiración agitada, tensión muscular y sudoración. Tu cuerpo se prepara para correr o pelear. Sin embargo, al estar sentados frente a una laptop o en una reunión, esa energía física no tiene a dónde ir y se siente sumamente incómoda.',
      'Al comprender que estas sensaciones son solo el sistema de alarma de tu cuerpo funcionando con un falso positivo, disminuye el miedo a la propia ansiedad y recuperamos la calma más rápido.'
    ]
  },
  {
    id: 'entrenar_atencion',
    title: '¿Cómo entrenar la atención?',
    excerpt: 'Herramientas y consejos prácticos para cultivar una presencia consciente en el día a día.',
    icon: Sparkles,
    color: 'var(--accent-success)',
    content: [
      'La atención es un músculo mental. Si no la entrenamos, vagará de forma automática de una preocupación a otra.',
      'Para entrenar la atención no necesitas pasar horas meditando. Puedes empezar con pequeñas prácticas diarias:',
      '1. Atención en los Sentidos (5-4-3-2-1): Desvía el foco de tu cabeza hacia lo que ves, hueles, tocas y oyes en este instante.',
      '2. Observación activa de lo positivo: Esfuérzate por notar al menos 3 pequeños actos de amabilidad o detalles estéticos durante tus trayectos cotidianos.',
      '3. Respiración anclada: Cuando sientas rumiación, posa toda tu atención en la temperatura del aire al entrar y salir de tus fosas nasales por solo 6 respiraciones continuas.',
      'Con el tiempo, estas prácticas cambian físicamente las conexiones de tu cerebro, facilitando la calma mental.'
    ]
  }
];

export const Library: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Explicación de la Biblioteca */}
      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '800px' }}>
        Aprender sobre cómo funciona nuestra mente es una herramienta fundamental en TCC (un proceso llamado psicoeducación). Explora los siguientes artículos explicados de manera sencilla y científica para entender mejor tus emociones y pensamientos.
      </p>

      {/* Grid de Artículos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '24px' 
      }}>
        {ARTICLES_LIST.map((art) => {
          const Icon = art.icon;
          return (
            <div 
              key={art.id} 
              className="card fade-in" 
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: art.color
                  }}>
                    <Icon size={18} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{art.title}</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '20px' }}>
                  {art.excerpt}
                </p>
              </div>

              <button 
                onClick={() => setSelectedArticle(art)}
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.85rem', padding: '10px' }}
              >
                <span>Leer Artículo</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal de Lectura */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedArticle(null)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              {React.createElement(selectedArticle.icon, { size: 24, style: { color: selectedArticle.color } })}
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>{selectedArticle.title}</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              {selectedArticle.content.map((p, idx) => (
                <p key={idx} style={{ 
                  fontSize: '0.95rem', 
                  color: 'var(--text-secondary)', 
                  lineHeight: '1.6',
                  textAlign: 'justify' 
                }}>
                  {p}
                </p>
              ))}
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedArticle(null)} 
                className="btn btn-primary"
              >
                Entendido, Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Library;
