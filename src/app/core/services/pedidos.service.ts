import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Pedido {
  id: number;
  date: string;
  time: string;
  status: 'primary' | 'success' | 'danger';
  statusLabel: string;
  progress: number;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private pedidos = new BehaviorSubject<Pedido[]>([]);
  pedidos$ = this.pedidos.asObservable();

  private stats = new BehaviorSubject({
    total: 0,
    entregados: 0,
    procesando: 0,
    cancelados: 0,
    totalGastado: 0
  });
  stats$ = this.stats.asObservable();

  constructor() {
    this.updateStats();
  }

  addPedido(pedido: Pedido): void {
    const current = this.pedidos.value;
    pedido.id = Math.max(0, ...current.map(p => p.id)) + 1001;
    current.push(pedido);
    this.pedidos.next([...current]);
    this.updateStats();
  }

  cancelPedido(id: number): void {
    const pedido = this.pedidos.value.find(p => p.id === id);
    if (pedido) {
      pedido.status = 'danger';
      pedido.statusLabel = 'Cancelado';
      this.pedidos.next([...this.pedidos.value]);
      this.updateStats();
    }
  }

  private updateStats(): void {
    const pedidos = this.pedidos.value;
    this.stats.next({
      total: pedidos.length,
      entregados: pedidos.filter(p => p.status === 'success').length,
      procesando: pedidos.filter(p => p.status === 'primary').length,
      cancelados: pedidos.filter(p => p.status === 'danger').length,
      totalGastado: parseFloat(pedidos.reduce((sum, p) => sum + p.total, 0).toFixed(2))
    });
  }

  getPedidos(): Pedido[] {
    return this.pedidos.value;
  }

  getStats() {
    return this.stats.value;
  }
}
