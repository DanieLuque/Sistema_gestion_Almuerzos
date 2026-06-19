import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ReservasService, Reserva } from '@core/services/reservas.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div @fadeIn class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Reservas List -->
        <div class="lg:col-span-2">
          <div class="mb-8 animate-slide-up">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
            <p class="text-gray-600">Gestiona tus reservas de almuerzos</p>
          </div>

          <!-- Filter Buttons -->
          <div class="mb-8 flex flex-wrap gap-3 animate-slide-up" style="animation-delay: 100ms;">
            <button *ngFor="let filter of filters"
              (click)="activeFilter = filter"
              class="px-4 py-2 rounded-full transition-all duration-300 font-medium"
              [class]="activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'">
              {{ filter }}
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div class="card text-center">
              <p class="text-2xl font-bold text-blue-600">{{ stats.total }}</p>
              <p class="text-sm text-gray-600">Total</p>
            </div>
            <div class="card text-center">
              <p class="text-2xl font-bold text-green-600">{{ stats.confirmadas }}</p>
              <p class="text-sm text-gray-600">Confirmadas</p>
            </div>
            <div class="card text-center">
              <p class="text-2xl font-bold text-purple-600">{{ stats.proximasPersonas }}</p>
              <p class="text-sm text-gray-600">Personas</p>
            </div>
          </div>

          <!-- Reservas Grid -->
          <div class="grid grid-cols-1 gap-6 animate-fade-in" style="animation-delay: 200ms;">
            <div *ngFor="let reserva of reservas; let i = index"
              class="card group hover:shadow-xl animate-scale-in"
              [style.animation-delay]="(i * 50) + 'ms'"
              *ngIf="filterReservas(reserva)">
              
              <!-- Status Badge -->
              <div class="flex items-center justify-between mb-4">
                <span [ngClass]="'badge badge-' + reserva.status">
                  {{ reserva.statusLabel }}
                </span>
                <div class="text-sm text-gray-500">{{ reserva.date }}</div>
              </div>

              <!-- Reserva Info -->
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ reserva.menu }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ reserva.description }}</p>

              <!-- Details -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div class="space-y-1 text-sm">
                  <p class="text-gray-600"><i class="fas fa-clock text-blue-500 mr-2"></i>{{ reserva.time }}</p>
                </div>
                <div class="space-y-1 text-sm">
                  <p class="text-gray-600"><i class="fas fa-users text-blue-500 mr-2"></i>{{ reserva.pessoas }} personas</p>
                </div>
                <div class="space-y-1 text-sm">
                  <p class="text-gray-600"><i class="fas fa-map-marker-alt text-blue-500 mr-2"></i>{{ reserva.location }}</p>
                </div>
                <div class="space-y-1 text-sm">
                  <p class="text-gray-600 font-bold text-blue-600">\${{ reserva.price }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button (click)="editReserva(reserva)" class="flex-1 btn btn-secondary py-2 text-sm">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button (click)="cancelReserva(reserva.id)" *ngIf="reserva.status !== 'danger'" class="flex-1 btn btn-outline py-2 text-sm">
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
          </div>
        </div>

        <!-- Nueva Reserva Form -->
        <div class="lg:col-span-1 animate-slide-up" style="animation-delay: 300ms;">
          <div class="card sticky top-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Nueva Reserva</h2>

            <form [formGroup]="reservaForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <!-- Menú -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Menú</label>
                <input type="text" formControlName="menu" placeholder="Ej: Pollo a la Brasa" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <!-- Descripción -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea formControlName="description" placeholder="Describe tu reserva" rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>

              <!-- Fecha -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input type="date" formControlName="date" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <!-- Hora -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input type="time" formControlName="time" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <!-- Personas -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Personas</label>
                <input type="number" formControlName="pessoas" min="1" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <!-- Ubicación -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input type="text" formControlName="location" placeholder="Ej: Oficina - Piso 3" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <!-- Precio -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input type="number" formControlName="price" step="0.01" min="0" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <button type="submit" [disabled]="!reservaForm.valid"
                class="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-plus"></i>
                Crear Reserva
              </button>
            </form>
          </div>
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
export class ReservasComponent implements OnInit {
  filters = ['Todas', 'Próximas', 'Confirmadas', 'Canceladas'];
  activeFilter = 'Todas';
  
  reservas: any[] = [];
  stats: any = {};
  reservaForm!: FormGroup;

  constructor(
    private reservasService: ReservasService,
    private fb: FormBuilder
  ) {
    this.reservaForm = this.fb.group({
      menu: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      pessoas: [1, [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.reservasService.reservas$.subscribe(reservas => {
      this.reservas = reservas;
    });

    this.reservasService.stats$.subscribe(stats => {
      this.stats = stats;
    });
  }

  filterReservas(reserva: any): boolean {
    if (this.activeFilter === 'Todas') return true;
    if (this.activeFilter === 'Próximas') return reserva.status === 'primary';
    if (this.activeFilter === 'Confirmadas') return reserva.statusLabel === 'Confirmada';
    if (this.activeFilter === 'Canceladas') return reserva.status === 'danger';
    return true;
  }

  onSubmit(): void {
    if (this.reservaForm.valid) {
      const newReserva: Reserva = {
        id: 0,
        ...this.reservaForm.value,
        status: 'primary',
        statusLabel: 'Confirmada'
      };
      this.reservasService.addReserva(newReserva);
      this.reservaForm.reset({ pessoas: 1, price: 0 });
    }
  }

  editReserva(reserva: Reserva): void {
    // Implementar edición
  }

  cancelReserva(id: number): void {
    this.reservasService.cancelReserva(id);
  }
}
