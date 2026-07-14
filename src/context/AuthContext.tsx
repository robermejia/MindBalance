import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../services/interfaces';
import { 
  getRepository, 
  getUseFirebaseSetting, 
  setUseFirebaseSetting, 
  isFirebaseConfigured, 
  firebaseRepositoryInstance,
  mockRepositoryInstance
} from '../services';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  useFirebase: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  toggleFirebase: (active: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [useFirebase, setUseFirebase] = useState<boolean>(getUseFirebaseSetting);

  // Efecto para escuchar el estado de autenticación (Firebase vs Mock)
  useEffect(() => {
    let unsubscribeFirebase: (() => void) | null = null;
    setLoading(true);

    const initAuth = async () => {
      if (useFirebase && isFirebaseConfigured()) {
        const auth = firebaseRepositoryInstance.getAuthInstance();
        if (auth) {
          // Procesar el resultado de la redirección al inicializar (sin bloquear el registro del listener)
          getRedirectResult(auth).catch((error) => {
            console.error("Error de redirección de Google Auth:", error);
          });

          unsubscribeFirebase = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
              try {
                const profile = await firebaseRepositoryInstance.getCurrentUser();
                setUser(profile);
              } catch (error) {
                console.error("Error al obtener perfil de Firebase Firestore:", error);
                setUser(null);
              }
            } else {
              setUser(null);
            }
            setLoading(false);
          });
          return;
        }
      }

      // Si no es Firebase o Firebase no está configurado, usamos Mock
      try {
        const mockUser = await mockRepositoryInstance.getCurrentUser();
        setUser(mockUser);
      } catch (error) {
        console.error("Error al obtener usuario de MockRepository:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (unsubscribeFirebase) unsubscribeFirebase();
    };
  }, [useFirebase]);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      if (useFirebase && isFirebaseConfigured()) {
        if (!password) throw new Error('Se requiere contraseña para iniciar sesión en Firebase');
        const profile = await firebaseRepositoryInstance.loginWithEmail(email, password);
        setUser(profile);
      } else {
        const profile = await mockRepositoryInstance.loginSimulated(email);
        setUser(profile);
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password?: string) => {
    setLoading(true);
    try {
      if (useFirebase && isFirebaseConfigured()) {
        if (!password) throw new Error('Se requiere contraseña para registrarse en Firebase');
        const profile = await firebaseRepositoryInstance.signupWithEmail(email, password);
        setUser(profile);
      } else {
        const profile = await mockRepositoryInstance.loginSimulated(email);
        setUser(profile);
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (useFirebase && isFirebaseConfigured()) {
      setLoading(true);
      try {
        const profile = await firebaseRepositoryInstance.loginWithGoogle();
        setUser(profile);
      } catch (error) {
        setUser(null);
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      throw new Error('Google Sign-In requiere activar y configurar Firebase primero.');
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const activeRepo = getRepository();
      await activeRepo.logout();
      setUser(null);
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const activeRepo = getRepository();
      const profile = await activeRepo.getCurrentUser();
      setUser(profile);
    } catch (error) {
      console.error("Error al refrescar usuario:", error);
    }
  };

  const toggleFirebase = (active: boolean) => {
    setUseFirebaseSetting(active);
    setUseFirebase(active);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      useFirebase,
      login,
      signup,
      loginWithGoogle,
      logout,
      refreshUser,
      toggleFirebase
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
