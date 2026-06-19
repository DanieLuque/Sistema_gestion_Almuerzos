import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PedidosService } from './pedidos.service';
import { ReservasService } from './reservas.service';

export interface DashboardStats {
  almuerzos_pendientes: number;
  reservas_confirmadas: number;
  usuarios_activos: number;
  ingresos_mes: number;
  pedidos_entregados: number;
  tasa_satisfaccion: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private stats = new BehaviorSubject<DashboardStats>({
    almuerzos_pendientes: 0,
    reservas_confirmadas: 0,
    usuarios_activos: 0,
    ingresos_mes: 0,
    pedidos_entregados: 0,
    tasa_satisfaccion: 0
  });

  stats$ = this.stats.asObservable();

  constructor(
    private pedidosService: PedidosService,
    private reservasService: ReservasService
  ) {
    this.updateStats();
  }

  private updateStats(): void {
    const pedidosStats = this.pedidosService.getStats();
    const reservasStats = this.reservasService.getStats();

    this.stats.next({
      almuerzos_pendientes: pedidosStats.procesando,
      reservas_confirmadas: reservasStats.confirmadas,
      usuarios_activos: 0,
      ingresos_mes: pedidosStats.totalGastado,
      pedidos_entregados: pedidosStats.entregados,
      tasa_satisfaccion: 0
    });
  }

  getStats(): DashboardStats {
    return this.stats.value;
  }
}
