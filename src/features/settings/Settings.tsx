import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Database, 
  Languages, 
  Sun, 
  Moon, 
  CheckCircle2,
  Download,
  Upload
} from 'lucide-react';
import { getRepository } from '../../services';

export const Settings: React.FC = () => {
  const { refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);



  const handleExport = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const repo = getRepository();
      const cbtRecords = await repo.getCbtRecords();
      const attentionRecords = await repo.getAttentionRecords();
      const exerciseSessions = await repo.getExerciseSessions();

      const backupData = {
        version: "1.0",
        source: "MindBalance",
        exportedAt: new Date().toISOString(),
        cbtRecords,
        attentionRecords,
        exerciseSessions
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `mindbalance_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      setStatusMessage({
        type: 'success',
        text: 'Copia de seguridad exportada con éxito. Revisa tus descargas.'
      });
    } catch (error) {
      console.error("Error al exportar datos:", error);
      setStatusMessage({
        type: 'error',
        text: 'Error al exportar la copia de seguridad.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const backup = JSON.parse(text);

        // Validaciones básicas del formato
        if (!backup || typeof backup !== 'object' || backup.source !== 'MindBalance') {
          throw new Error('El archivo no parece ser un respaldo válido de MindBalance.');
        }

        const repo = getRepository();
        let cbtCount = 0;
        let attentionCount = 0;
        let exerciseCount = 0;

        // Importar CBT Records
        if (Array.isArray(backup.cbtRecords)) {
          for (const record of backup.cbtRecords) {
            const cleanRecord = {
              q1_whatHappened: record.q1_whatHappened || '',
              q2_directObservation: record.q2_directObservation || [],
              q3_automaticThought: record.q3_automaticThought || '',
              q4_emotions: record.q4_emotions || { ansiedad: 0, miedo: 0, tristeza: 0, molestia: 0, verguenza: 0, enojo: 0 },
              q5_intensity: record.q5_intensity ?? 50,
              q6_supportingEvidence: record.q6_supportingEvidence || '',
              q7_opposingEvidence: record.q7_opposingEvidence || '',
              q8_alternativeExplanations: record.q8_alternativeExplanations || [],
              q9_balancedExplanation: record.q9_balancedExplanation || '',
              q10_whatLearned: record.q10_whatLearned || '',
              date: record.date
            };
            await repo.saveCbtRecord(cleanRecord);
            cbtCount++;
          }
        }

        // Importar Attention Records
        if (Array.isArray(backup.attentionRecords)) {
          for (const record of backup.attentionRecords) {
            const cleanRecord = {
              neutralConversations: record.neutralConversations ?? 0,
              pleasantConversations: record.pleasantConversations ?? 0,
              unpleasantConversations: record.unpleasantConversations ?? 0,
              greetingsObserved: record.greetingsObserved ?? 0,
              collaborationsObserved: record.collaborationsObserved ?? 0,
              smilesObserved: record.smilesObserved ?? 0,
              date: record.date
            };
            await repo.saveAttentionRecord(cleanRecord);
            attentionCount++;
          }
        }

        // Importar Exercise Sessions
        if (Array.isArray(backup.exerciseSessions)) {
          for (const session of backup.exerciseSessions) {
            const cleanSession = {
              exerciseId: session.exerciseId || 'breathing',
              exerciseName: session.exerciseName || 'Respiración Consciente',
              durationSeconds: session.durationSeconds ?? 0,
              notes: session.notes,
              date: session.date
            };
            await repo.saveExerciseSession(cleanSession);
            exerciseCount++;
          }
        }

        setStatusMessage({
          type: 'success',
          text: `¡Importación exitosa! Se restauraron: ${cbtCount} registros TCC, ${attentionCount} observaciones de atención y ${exerciseCount} sesiones de ejercicios.`
        });
        
        await refreshUser();
      } catch (err: any) {
        console.error("Error al importar archivo:", err);
        setStatusMessage({
          type: 'error',
          text: err.message || 'Error al procesar el archivo JSON. Verifica que el archivo no esté corrupto.'
        });
      } finally {
        setLoading(false);
        event.target.value = '';
      }
    };

    reader.readAsText(file);
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

      {/* Copia de Seguridad y Portabilidad */}
      <div className="card fade-in">
        <h2 className="card-title">
          <Database size={20} style={{ color: 'var(--accent-primary)' }} />
          Copia de Seguridad y Portabilidad
        </h2>
        
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
          Exporta todos tus registros, observaciones de atención y sesiones de ejercicios en un archivo JSON local. Puedes importar este archivo más tarde para restaurar tu historial clínico y de práctica en cualquier momento.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={handleExport}
            disabled={loading}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} />
            Exportar Datos (JSON)
          </button>

          <label
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0, height: '38px', justifyContent: 'center' }}
          >
            <Upload size={16} />
            <span>Importar Datos (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>


    </div>
  );
};
export default Settings;
