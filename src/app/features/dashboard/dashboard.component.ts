import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { DashboardService } from '@core/services/dashboard.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div @fadeIn class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8 animate-slide-up">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Bienvenido al sistema de gestión de almuerzos</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div *ngFor="let stat of stats; let i = index" 
          class="card animate-scale-in" 
          [style.animation-delay]="(i * 100) + 'ms'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">{{ stat.label }}</p>
              <h3 class="text-3xl font-bold text-gray-900 mt-2">{{ stat.value }}</h3>
            </div>
            <div class="p-3 rounded-lg" [style.backgroundColor]="stat.bgColor">
              <i [class]="stat.icon + ' text-2xl'" [style.color]="stat.color"></i>
            </div>
          </div>
          <p class="text-xs" [ngClass]="stat.trend >= 0 ? 'text-green-600' : 'text-red-600'" *ngIf="stat.trend !== 0">
            <i [class]="stat.trend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ stat.trend | number:'+1.0-0' }}% desde la semana pasada
          </p>
        </div>
      </div>

      <!-- Welcome Message -->
      <div class="card glass mb-8 animate-fade-in" style="animation-delay: 400ms;">
        <div class="flex items-center gap-4">
          <div class="p-4 bg-blue-100 rounded-lg">
            <i class="fas fa-lightbulb text-3xl text-blue-600"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">¡Empieza ahora!</h3>
            <p class="text-gray-600 mt-1">Explora nuestras funcionalidades principales para gestionar tus almuerzos.</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="animate-slide-up" style="animation-delay: 500ms;">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a routerLink="/menu" class="btn btn-primary w-full">
            <i class="fas fa-plus"></i>
            Nuevo Pedido
          </a>
          <a routerLink="/reservas" class="btn btn-secondary w-full">
            <i class="fas fa-calendar"></i>
            Hacer Reserva
          </a>
          <a routerLink="/pedidos" class="btn btn-outline w-full">
            <i class="fas fa-history"></i>
            Ver Historial
          </a>
        </div>
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
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  stats: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.stats$.subscribe(dashStats => {
      this.stats = [
        { label: 'Almuerzos Pendientes', value: dashStats.almuerzos_pendientes, icon: 'fas fa-utensils', bgColor: '#fef3c7', color: '#f59e0b', trend: 0 },
        { label: 'Reservas Confirmadas', value: dashStats.reservas_confirmadas, icon: 'fas fa-check-circle', bgColor: '#d1fae5', color: '#10b981', trend: 0 },
        { label: 'Pedidos Entregados', value: dashStats.pedidos_entregados, icon: 'fas fa-box', bgColor: '#dbeafe', color: '#3b82f6', trend: 0 },
        { label: 'Ingresos del Mes', value: '$' + dashStats.ingresos_mes.toFixed(2), icon: 'fas fa-dollar-sign', bgColor: '#fce7f3', color: '#ec4899', trend: 0 }
      ];
    });
  }
}
