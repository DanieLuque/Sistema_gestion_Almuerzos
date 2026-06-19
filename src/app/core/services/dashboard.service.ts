import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PedidosService } from './pedidos.service';
import { ReservasService } from './reservas.service';
import { DashboardStats } from '@database/models';

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
    tasa_satisfaccion: 95
  });

  stats$ = this.stats.asObservable();

  constructor(
    private pedidosService: PedidosService,
    private reservasService: ReservasService
  ) {
    this.initializeStats();
  }

  /**
   * Inicializar estadísticas en tiempo real desde servicios
   */
  private initializeStats(): void {
    combineLatest([
      this.pedidosService.stats$,
      this.pedidosService.pedidos$,
      this.reservasService.stats$,
      this.reservasService.reservas$
    ]).pipe(
      map(([pedidosStats, pedidosItems, reservasStats, reservasItems]) => {
        // Calcular estadísticas del mes (últimos 30 días)
        const ahora = new Date();
        const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);

        const pedidosMes = pedidosItems.filter(p => 
          new Date(p.createdAt) >= hace30Dias
        );

        const ingresosMes = pedidosMes.reduce((sum, p) => sum + p.total, 0);

        return {
          almuerzos_pendientes: pedidosStats.procesando,
          reservas_confirmadas: reservasStats.confirmadas,
          usuarios_activos: 1, // Placeholder - en producción vendría de usuarios activos
          ingresos_mes: parseFloat(ingresosMes.toFixed(2)),
          pedidos_entregados: pedidosStats.entregados,
          tasa_satisfaccion: 95 // Placeholder - calcular desde reseñas reales
        } as DashboardStats;
      })
    ).subscribe(
      newStats => this.stats.next(newStats),
      error => console.error('Error actualizando estadísticas del dashboard:', error)
    );
  }

  /**
   * Obtener estadísticas actuales
   */
  getStats(): DashboardStats {
    return this.stats.value;
  }
}
