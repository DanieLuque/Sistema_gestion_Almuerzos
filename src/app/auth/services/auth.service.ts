import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { firstValueFrom, map } from 'rxjs';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}
  // Observable de estado de autenticación
  user$ = authState(this.auth);

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string, role: 'admin' | 'cliente' = 'cliente') {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    // Crear documento de usuario en Firestore con rol indicado
    try {
      const db = getFirestore();
      await setDoc(doc(db, 'users', credential.user.uid), {
        email,
        role,
        activo: true,
        fechaCreacion: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error creando documento de usuario:', err);
    }
    return credential;
  }

  logout() {
    return signOut(this.auth);
  }

  async isAuthenticated(): Promise<boolean> {
    const exists = await firstValueFrom(this.user$.pipe(map(u => !!u)));
    return exists;
  }

  async getRole(): Promise<string | null> {
    const user = await firstValueFrom(this.user$);
    if (!user) return null;
    try {
      const db = getFirestore();
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        // @ts-ignore
        return snap.data().role ?? null;
      }
    } catch (err) {
      console.error('Error leyendo rol de usuario:', err);
    }
    return null;
  }

  async isAdmin(): Promise<boolean> {
    const role = await this.getRole();
    return role === 'admin';
  }
}