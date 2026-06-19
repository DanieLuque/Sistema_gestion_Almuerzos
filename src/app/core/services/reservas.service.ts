import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Reserva {
  id: number;
  menu: string;
  description: string;
  date: string;
  time: string;
  pessoas: number;
  location: string;
  price: number;
  status: 'primary' | 'success' | 'danger';
  statusLabel: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private reservas = new BehaviorSubject<Reserva[]>([]);
  reservas$ = this.reservas.asObservable();

  private stats = new BehaviorSubject({
    total: 0,
    confirmadas: 0,
    pendientes: 0,
    canceladas: 0,
    proximasPersonas: 0
  });
  stats$ = this.stats.asObservable();

  constructor() {
    this.updateStats();
  }

  addReserva(reserva: Reserva): void {
    const current = this.reservas.value;
    reserva.id = Math.max(0, ...current.map(r => r.id)) + 1;
    current.push(reserva);
    this.reservas.next([...current]);
    this.updateStats();
  }

  updateReserva(id: number, updates: Partial<Reserva>): void {
    const reserva = this.reservas.value.find(r => r.id === id);
    if (reserva) {
      Object.assign(reserva, updates);
      this.reservas.next([...this.reservas.value]);
      this.updateStats();
    }
  }

  cancelReserva(id: number): void {
    const reserva = this.reservas.value.find(r => r.id === id);
    if (reserva) {
      reserva.status = 'danger';
      reserva.statusLabel = 'Cancelada';
      this.reservas.next([...this.reservas.value]);
      this.updateStats();
    }
  }

  private updateStats(): void {
    const reservas = this.reservas.value;
    this.stats.next({
      total: reservas.length,
      confirmadas: reservas.filter(r => r.status === 'primary').length,
      pendientes: reservas.filter(r => r.statusLabel === 'Pendiente').length,
      canceladas: reservas.filter(r => r.status === 'danger').length,
      proximasPersonas: reservas.reduce((sum, r) => sum + r.pessoas, 0)
    });
  }

  getReservas(): Reserva[] {
    return this.reservas.value;
  }

  getStats() {
    return this.stats.value;
  }
}
