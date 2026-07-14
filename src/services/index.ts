import type { IRepository } from './interfaces';
import { mockRepositoryInstance } from './mockRepository';
import { firebaseRepositoryInstance } from './firebaseRepository';

export function isFirebaseConfigured(): boolean {
  return firebaseRepositoryInstance.isInitialized();
}

export function getUseFirebaseSetting(): boolean {
  return isFirebaseConfigured();
}

export function setUseFirebaseSetting(_value: boolean): void {
  // No-op: Firebase is always enabled in the background when configured.
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
