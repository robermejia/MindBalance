import type { IRepository } from './interfaces';
import { mockRepositoryInstance } from './mockRepository';
import { firebaseRepositoryInstance } from './firebaseRepository';

export function isFirebaseConfigured(): boolean {
  return firebaseRepositoryInstance.isInitialized();
}

export function getUseFirebaseSetting(): boolean {
  const setting = localStorage.getItem('mb_use_firebase');
  // Por defecto, si Firebase está inicializado correctamente, intentamos usarlo.
  // Pero el usuario puede desactivarlo o activarlo en Configuración.
  if (setting === null) {
    return isFirebaseConfigured();
  }
  return setting === 'true';
}

export function setUseFirebaseSetting(value: boolean): void {
  localStorage.setItem('mb_use_firebase', value ? 'true' : 'false');
  // Recargar la página o notificar cambio de estado para reiniciar contextos
}

export function getRepository(): IRepository {
  const useFirebase = getUseFirebaseSetting();
  if (useFirebase && isFirebaseConfigured()) {
    return firebaseRepositoryInstance;
  }
  return mockRepositoryInstance;
}

export * from './interfaces';
export { mockRepositoryInstance } from './mockRepository';
export { firebaseRepositoryInstance, FirebaseRepository } from './firebaseRepository';
export const repository = getRepository();
export default repository;
