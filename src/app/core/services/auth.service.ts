import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
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

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return new Observable(observer => {
      // Simulación de login
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          name: 'Juan Pérez',
          email: email,
          role: 'user'
        };
        const mockToken = 'fake-token-' + Date.now();

        this.setToken(mockToken);
        this.setUser(mockUser);

        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(mockUser);

        observer.next({ token: mockToken, user: mockUser });
        observer.complete();
      }, 1000);
    });
  }

  register(name: string, email: string, password: string): Observable<{ token: string; user: User }> {
    return new Observable(observer => {
      // Simulación de registro
      setTimeout(() => {
        const mockUser: User = {
          id: '2',
          name: name,
          email: email,
          role: 'user'
        };
        const mockToken = 'fake-token-' + Date.now();

        this.setToken(mockToken);
        this.setUser(mockUser);

        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(mockUser);

        observer.next({ token: mockToken, user: mockUser });
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getCurrentUser(): User | null {
    return this.getStoredUser();
  }
}
