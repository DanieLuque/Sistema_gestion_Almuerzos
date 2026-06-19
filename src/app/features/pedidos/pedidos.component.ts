import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { PedidosService } from '@core/services/pedidos.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div @fadeIn class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8 animate-slide-up">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
        <p class="text-gray-600">Historial y seguimiento de tus pedidos</p>
      </div>

      <!-- Filter Buttons -->
      <div class="mb-8 flex flex-wrap gap-3 animate-slide-up" style="animation-delay: 100ms;">
        <button *ngFor="let filter of filters"
          (click)="activeFilter = filter"
          class="px-4 py-2 rounded-full transition-all duration-300 font-medium"
          [class]="activeFilter === filter ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-600'">
          {{ filter }}
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="card text-center">
          <p class="text-2xl font-bold text-orange-600">{{ stats.total }}</p>
          <p class="text-sm text-gray-600">Total Pedidos</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold text-blue-600">{{ stats.procesando }}</p>
          <p class="text-sm text-gray-600">En Proceso</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold text-green-600">{{ stats.entregados }}</p>
          <p class="text-sm text-gray-600">Entregados</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold text-purple-600">\${{ stats.totalGastado }}</p>
          <p class="text-sm text-gray-600">Total Gastado</p>
        </div>
      </div>

      <!-- Pedidos List -->
      <div class="space-y-4 animate-fade-in" style="animation-delay: 200ms;">
        <div *ngFor="let pedido of pedidos; let i = index"
          class="card group hover:shadow-lg animate-slide-up"
          [style.animation-delay]="(i * 50) + 'ms'"
          *ngIf="filterPedidos(pedido)">
          
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Left Info -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Pedido #{{ pedido.id }}</h3>
                  <p class="text-sm text-gray-500">{{ pedido.date }} - {{ pedido.time }}</p>
                </div>
                <span [ngClass]="'badge badge-' + pedido.status">
                  {{ pedido.statusLabel }}
                </span>
              </div>

              <!-- Items -->
              <div class="mb-4">
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Artículos:</h4>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li *ngFor="let item of pedido.items" class="flex justify-between">
                    <span>{{ item.quantity }}x {{ item.name }}</span>
                    <span>\${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </li>
                </ul>
              </div>

              <!-- Progress Bar -->
              <div *ngIf="pedido.status === 'primary'" class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-600">Progreso</span>
                  <span class="text-xs text-gray-500">{{ pedido.progress }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                    [style.width.%]="pedido.progress"></div>
                </div>
              </div>
            </div>

            <!-- Right Info -->
            <div class="md:border-l border-gray-200 md:pl-6 flex flex-col justify-between">
              <!-- Total -->
              <div class="mb-4 p-4 bg-orange-50 rounded-lg">
                <p class="text-gray-600 text-sm mb-1">Total</p>
                <p class="text-3xl font-bold text-orange-600">\${{ pedido.total }}</p>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button class="flex-1 btn btn-secondary py-2 text-sm">
                  <i class="fas fa-eye"></i>
                </button>
                <button *ngIf="pedido.status === 'primary'" 
                  (click)="cancelPedido(pedido.id)"
                  class="flex-1 btn btn-outline py-2 text-sm">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="pedidos.length === 0" class="text-center py-16 animate-slide-up">
        <div class="p-4 bg-gray-100 rounded-full inline-block mb-4">
          <i class="fas fa-shopping-bag text-4xl text-gray-400"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No hay pedidos</h3>
        <p class="text-gray-600 mb-6">Aún no tienes pedidos registrados</p>
        <a routerLink="/menu" class="btn btn-primary">Hacer Pedido</a>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class PedidosComponent implements OnInit {
  filters = ['Todos', 'En Proceso', 'Entregados', 'Cancelados'];
  activeFilter = 'Todos';
  
  pedidos: any[] = [];
  stats: any = {};

  constructor(private pedidosService: PedidosService) {}

  ngOnInit(): void {
    this.pedidosService.pedidos$.subscribe(pedidos => {
      this.pedidos = pedidos;
    });

    this.pedidosService.stats$.subscribe(stats => {
      this.stats = stats;
    });
  }

  filterPedidos(pedido: any): boolean {
    if (this.activeFilter === 'Todos') return true;
    if (this.activeFilter === 'En Proceso') return pedido.status === 'primary';
    if (this.activeFilter === 'Entregados') return pedido.status === 'success';
    if (this.activeFilter === 'Cancelados') return pedido.status === 'danger';
    return true;
  }

  cancelPedido(id: number): void {
    this.pedidosService.cancelPedido(id);
  }
}
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class PedidosComponent {
  filters = [
    { label: 'Todos', active: true },
    { label: 'En Proceso', active: false },
    { label: 'Entregados', active: false },
    { label: 'Cancelados', active: false }
  ];

  pedidos: any[] = [];
}
