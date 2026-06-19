import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Firestore, collection, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Usuario } from '@database/models';
import { of } from 'rxjs';

export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.initializeAuthState();
  }

  /**
   * Inicializar estado de autenticación desde Firebase
   */
  private initializeAuthState(): void {
    onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Obtener datos del usuario desde Firestore
          const usuarioRef = doc(this.firestore, 'usuarios', firebaseUser.uid);
          const usuarioSnap = await getDoc(usuarioRef);

          if (usuarioSnap.exists()) {
            const usuarioData = usuarioSnap.data() as Usuario;
            const user: User = {
              id: usuarioData.id,
              uid: firebaseUser.uid,
              name: usuarioData.nombre,
              email: firebaseUser.email || '',
              role: usuarioData.rol
            };

            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          }
        } catch (error) {
          console.error('Error cargando usuario:', error);
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
        }
      } else {
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
        localStorage.removeItem(this.USER_KEY);
      }
    });
  }

  /**
   * Login con email y password
   */
  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(result => {
        const usuarioRef = doc(this.firestore, 'usuarios', result.user.uid);
        return from(getDoc(usuarioRef)).pipe(
          map(usuarioSnap => {
            if (usuarioSnap.exists()) {
              const usuarioData = usuarioSnap.data() as Usuario;
              const user: User = {
                id: usuarioData.id,
                uid: result.user.uid,
                name: usuarioData.nombre,
                email: result.user.email || '',
                role: usuarioData.rol
              };
              this.currentUserSubject.next(user);
              this.isAuthenticatedSubject.next(true);
              localStorage.setItem(this.USER_KEY, JSON.stringify(user));
              return user;
            }
            throw new Error('Usuario no encontrado en Firestore');
          })
        );
      }),
      catchError(error => {
        console.error('Error en login:', error);
        throw error;
      })
    );
  }

  /**
   * Registro de nuevo usuario
   */
  register(nombre: string, email: string, password: string, rol: string = 'cliente'): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(result => {
        const nuevoUsuario: Usuario = {
          id: result.user.uid,
          uid: result.user.uid,
          nombre: nombre,
          email: email,
          rol: rol as 'cliente' | 'admin' | 'gerente',
          activo: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const usuarioRef = doc(this.firestore, 'usuarios', result.user.uid);
        return from(setDoc(usuarioRef, nuevoUsuario)).pipe(
          map(() => {
            const user: User = {
              id: nuevoUsuario.id,
              uid: result.user.uid,
              name: nuevoUsuario.nombre,
              email: email,
              role: nuevoUsuario.rol
            };
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
            return user;
          })
        );
      }),
      catchError(error => {
        console.error('Error en registro:', error);
        throw error;
      })
    );
  }

  /**
   * Logout
   */
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        localStorage.removeItem(this.USER_KEY);
      }),
      catchError(error => {
        console.error('Error en logout:', error);
        throw error;
      })
    );
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Obtener Firebase Auth User
   */
  getFirebaseUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }
}
