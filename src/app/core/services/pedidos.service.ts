import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Pedido, PedidoItem, PedidosStats } from '@database/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private pedidos = new BehaviorSubject<Pedido[]>([]);
  pedidos$ = this.pedidos.asObservable();

  private stats = new BehaviorSubject<PedidosStats>({
    total: 0,
    procesando: 0,
    entregados: 0,
    cancelados: 0,
    totalGastado: 0
  });
  stats$ = this.stats.asObservable();

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.initializePedidos();
  }

  /**
   * Inicializar pedidos del usuario actual desde Firestore
   */
  private initializePedidos(): void {
    this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          this.pedidos.next([]);
          this.updateStats();
          return new Observable(observer => observer.complete());
        }

        const pedidosRef = collection(this.firestore, 'pedidos');
        const q = query(pedidosRef, where('userId', '==', user.uid));
        return collectionData(q, { idField: 'id' });
      })
    ).subscribe(
      (items: any) => {
        const pedidosArray = (Array.isArray(items) ? items : []) as any[];
        const pedidos = pedidosArray.map(item => ({
          ...item,
          createdAt: item.createdAt?.toDate?.() || new Date(),
          updatedAt: item.updatedAt?.toDate?.() || new Date()
        })) as Pedido[];
        this.pedidos.next(pedidos);
        this.updateStats();
      },
      error => console.error('Error cargando pedidos:', error)
    );
  }

  /**
   * Crear nuevo pedido
   */
  async addPedido(items: PedidoItem[], total: number, notas?: string): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const nowDate = new Date();
    const dateStr = nowDate.toLocaleDateString('es-ES');
    const timeStr = nowDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const nuevoPedido: Omit<Pedido, 'id'> = {
      userId: user.uid,
      items: items,
      total: total,
      status: 'pendiente',
      statusLabel: 'Pendiente',
      progress: 0,
      date: dateStr,
      time: timeStr,
      createdAt: nowDate,
      updatedAt: nowDate,
      notas: notas
    };

    try {
      const pedidosRef = collection(this.firestore, 'pedidos');
      await addDoc(pedidosRef, nuevoPedido);
      this.initializePedidos(); // Recargar lista
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  }

  /**
   * Actualizar estado de pedido
   */
  async updatePedido(id: string, status: 'pendiente' | 'procesando' | 'entregado' | 'cancelado', progress?: number): Promise<void> {
    try {
      const pedidoRef = doc(this.firestore, 'pedidos', id);
      const statusLabel = this.getStatusLabel(status);
      
      await updateDoc(pedidoRef, {
        status: status,
        statusLabel: statusLabel,
        progress: progress || 0,
        updatedAt: new Date()
      });
      this.initializePedidos(); // Recargar lista
    } catch (error) {
      console.error('Error actualizando pedido:', error);
      throw error;
    }
  }

  /**
   * Cancelar pedido
   */
  async cancelPedido(id: string): Promise<void> {
    await this.updatePedido(id, 'cancelado');
  }

  /**
   * Obtener mapeo de estado a etiqueta
   */
  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pendiente': 'Pendiente',
      'procesando': 'En Proceso',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    return labels[status] || 'Desconocido';
  }

  /**
   * Actualizar estadísticas
   */
  private updateStats(): void {
    const pedidos = this.pedidos.value;
    this.stats.next({
      total: pedidos.length,
      procesando: pedidos.filter(p => p.status === 'procesando').length,
      entregados: pedidos.filter(p => p.status === 'entregado').length,
      cancelados: pedidos.filter(p => p.status === 'cancelado').length,
      totalGastado: parseFloat(pedidos.reduce((sum, p) => sum + p.total, 0).toFixed(2))
    });
  }

  /**
   * Obtener pedidos actuales
   */
  getPedidos(): Pedido[] {
    return this.pedidos.value;
  }

  /**
   * Obtener estadísticas
   */
  getStats(): PedidosStats {
    return this.stats.value;
  }
}
