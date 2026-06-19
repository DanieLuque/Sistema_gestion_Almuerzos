import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div @fadeIn class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8 animate-slide-up">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
        <p class="text-gray-600">Gestiona tus reservas de almuerzos</p>
      </div>

      <!-- Filter Buttons -->
      <div class="mb-8 flex flex-wrap gap-3 animate-slide-up" style="animation-delay: 100ms;">
        <button *ngFor="let filter of filters"
          class="px-4 py-2 rounded-full transition-all duration-300 font-medium"
          [class]="filter.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'">
          {{ filter.label }}
        </button>
      </div>

      <!-- Reservas Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style="animation-delay: 200ms;">
        <div *ngFor="let reserva of reservas; let i = index"
          class="card group hover:shadow-xl animate-scale-in"
          [style.animation-delay]="(i * 100) + 'ms'">
          
          <!-- Status Badge -->
          <div class="flex items-center justify-between mb-4">
            <span [ngClass]="'badge ' + 'badge-' + reserva.status">
              {{ reserva.statusLabel }}
            </span>
            <div class="text-sm text-gray-500">{{ reserva.date }}</div>
          </div>

          <!-- Reserva Info -->
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ reserva.menu }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ reserva.description }}</p>

          <!-- Details -->
          <div class="space-y-2 mb-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <i class="fas fa-clock text-blue-500 w-4"></i>
              <span>{{ reserva.time }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-users text-blue-500 w-4"></i>
              <span>{{ reserva.pessoas }} personas</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-map-marker-alt text-blue-500 w-4"></i>
              <span>{{ reserva.location }}</span>
            </div>
          </div>

          <!-- Price -->
          <div class="mb-4 p-3 bg-blue-50 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">Total</span>
              <span class="text-2xl font-bold text-blue-600">\${{ reserva.price }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button class="flex-1 btn btn-secondary py-2 text-sm">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="flex-1 btn btn-outline py-2 text-sm">
              <i class="fas fa-trash"></i> Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="reservas.length === 0" class="text-center py-16 animate-slide-up">
        <div class="p-4 bg-gray-100 rounded-full inline-block mb-4">
          <i class="fas fa-inbox text-4xl text-gray-400"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No hay reservas</h3>
        <p class="text-gray-600 mb-6">Aún no tienes reservas de almuerzos</p>
        <a routerLink="/menu" class="btn btn-primary">Hacer una Reserva</a>
      </div>

      <!-- Create Button -->
      <div class="fixed bottom-8 right-8 z-40">
        <button class="btn btn-primary rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-300 shadow-lg">
          <i class="fas fa-plus"></i>
        </button>
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
export class ReservasComponent {
  filters = [
    { label: 'Todas', active: true },
    { label: 'Próximas', active: false },
    { label: 'Pasadas', active: false },
    { label: 'Canceladas', active: false }
  ];

  reservas = [
    {
      id: 1,
      menu: 'Pollo a la Brasa',
      description: 'Pollo tierno con papas y ensalada fresca',
      date: '2026-06-25',
      time: '12:30 PM',
      pessoas: 2,
      location: 'Oficina - Piso 3',
      price: 15.99,
      status: 'primary',
      statusLabel: 'Confirmada'
    },
    {
      id: 2,
      menu: 'Ensalada Caesar',
      description: 'Lechuga fresca con pollo y queso parmesano',
      date: '2026-06-26',
      time: '1:00 PM',
      pessoas: 1,
      location: 'Oficina - Comedor',
      price: 12.99,
      status: 'primary',
      statusLabel: 'Confirmada'
    },
    {
      id: 3,
      menu: 'Filete de Salmón',
      description: 'Salmón fresco al horno con limón',
      date: '2026-06-27',
      time: '12:00 PM',
      pessoas: 3,
      location: 'Oficina - Piso 2',
      price: 18.99,
      status: 'primary',
      statusLabel: 'Pendiente'
    }
  ];
}
