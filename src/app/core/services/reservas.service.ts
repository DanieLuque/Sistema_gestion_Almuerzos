import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Reserva, ReservasStats } from '@database/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private reservas = new BehaviorSubject<Reserva[]>([]);
  reservas$ = this.reservas.asObservable();

  private stats = new BehaviorSubject<ReservasStats>({
    total: 0,
    confirmadas: 0,
    pendientes: 0,
    canceladas: 0,
    proximasPersonas: 0
  });
  stats$ = this.stats.asObservable();

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.initializeReservas();
  }

  /**
   * Inicializar reservas del usuario actual desde Firestore
   */
  private initializeReservas(): void {
    this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          this.reservas.next([]);
          this.updateStats();
          return new Observable(observer => observer.complete());
        }

        const reservasRef = collection(this.firestore, 'reservas');
        const q = query(reservasRef, where('userId', '==', user.uid));
        return collectionData(q, { idField: 'id' });
      })
    ).subscribe(
      (items: any) => {
        const reservasArray = (Array.isArray(items) ? items : []) as any[];
        const reservas = reservasArray.map(item => ({
          ...item,
          createdAt: item.createdAt?.toDate?.() || new Date(),
          updatedAt: item.updatedAt?.toDate?.() || new Date()
        })) as Reserva[];
        this.reservas.next(reservas);
        this.updateStats();
      },
      error => console.error('Error cargando reservas:', error)
    );
  }

  /**
   * Crear nueva reserva
   */
  async addReserva(data: Omit<Reserva, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const nuevaReserva: Omit<Reserva, 'id'> = {
      ...data,
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const reservasRef = collection(this.firestore, 'reservas');
      await addDoc(reservasRef, nuevaReserva);
      this.initializeReservas(); // Recargar lista
    } catch (error) {
      console.error('Error creando reserva:', error);
      throw error;
    }
  }

  /**
   * Actualizar reserva
   */
  async updateReserva(id: string, updates: Partial<Reserva>): Promise<void> {
    try {
      const reservaRef = doc(this.firestore, 'reservas', id);
      await updateDoc(reservaRef, {
        ...updates,
        updatedAt: new Date()
      });
      this.initializeReservas(); // Recargar lista
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      throw error;
    }
  }

  /**
   * Cancelar reserva
   */
  async cancelReserva(id: string): Promise<void> {
    await this.updateReserva(id, {
      status: 'cancelada',
      statusLabel: 'Cancelada'
    });
  }

  /**
   * Actualizar estadísticas
   */
  private updateStats(): void {
    const reservas = this.reservas.value;
    this.stats.next({
      total: reservas.length,
      confirmadas: reservas.filter(r => r.status === 'confirmada').length,
      pendientes: reservas.filter(r => r.status === 'pendiente').length,
      canceladas: reservas.filter(r => r.status === 'cancelada').length,
      proximasPersonas: reservas.reduce((sum, r) => sum + r.pessoas, 0)
    });
  }

  /**
   * Obtener reservas actuales
   */
  getReservas(): Reserva[] {
    return this.reservas.value;
  }

  /**
   * Obtener estadísticas
   */
  getStats(): ReservasStats {
    return this.stats.value;
  }
}
