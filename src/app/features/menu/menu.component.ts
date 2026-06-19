import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div @fadeIn class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8 animate-slide-up">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Menú del Día</h1>
        <p class="text-gray-600">Selecciona tu almuerzo favorito para hoy</p>
      </div>

      <!-- Menu Filter -->
      <div class="mb-8 flex flex-wrap gap-3 animate-slide-up" style="animation-delay: 100ms;">
        <button *ngFor="let filter of filters" 
          class="px-4 py-2 rounded-full transition-all duration-300 font-medium"
          [class]="filter.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'">
          {{ filter.label }}
        </button>
      </div>

      <!-- Menu Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style="animation-delay: 200ms;">
        <div *ngFor="let item of menuItems; let i = index"
          class="card group hover:shadow-xl animate-scale-in"
          [style.animation-delay]="(i * 100) + 'ms'">
          <!-- Image -->
          <div class="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
            <i [class]="item.icon + ' text-6xl text-blue-400 opacity-50'"></i>
          </div>

          <!-- Content -->
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ item.name }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ item.description }}</p>

          <!-- Price & Rating -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-2xl font-bold text-blue-600">${{ item.price }}</span>
            <div class="flex items-center gap-1">
              <i *ngFor="let star of [1,2,3,4,5]" 
                class="fas fa-star text-yellow-400"
                [class.opacity-30]="star > item.rating"></i>
            </div>
          </div>

          <!-- Button -->
          <button class="btn btn-primary w-full group-hover:translate-y-0 transform translate-y-1 opacity-90 group-hover:opacity-100 transition-all duration-300">
            <i class="fas fa-shopping-cart"></i>
            Agregar al Carrito
          </button>
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
export class MenuComponent {
  filters = [
    { label: 'Todos', active: true },
    { label: 'Carnes', active: false },
    { label: 'Vegetarianos', active: false },
    { label: 'Pescados', active: false },
    { label: 'Bajo en Calorías', active: false }
  ];

  menuItems = [
    {
      id: 1,
      name: 'Pechuga de Pollo Grillada',
      description: 'Pechuga tierna acompañada de verduras frescas y salsa casera',
      price: 8.99,
      rating: 5,
      icon: 'fas fa-drumstick-bite'
    },
    {
      id: 2,
      name: 'Ensalada César Premium',
      description: 'Lechuga fresca con pollo grillado, queso parmesano y croutons',
      price: 7.99,
      rating: 4,
      icon: 'fas fa-leaf'
    },
    {
      id: 3,
      name: 'Filete de Salmón',
      description: 'Salmón fresco al horno con limón y hierbas aromáticas',
      price: 12.99,
      rating: 5,
      icon: 'fas fa-fish'
    },
    {
      id: 4,
      name: 'Pasta Alfredo',
      description: 'Pasta fresca con salsa Alfredo cremosa y jamón serrano',
      price: 8.49,
      rating: 4,
      icon: 'fas fa-bowl-food'
    },
    {
      id: 5,
      name: 'Hamburguesa Artesanal',
      description: 'Carne de res con queso fundido, tomate y lechuga',
      price: 9.99,
      rating: 4,
      icon: 'fas fa-burger'
    },
    {
      id: 6,
      name: 'Tacos de Carnitas',
      description: 'Tacos tradicionales con carne lenta, cebolla y cilantro',
      price: 7.49,
      rating: 5,
      icon: 'fas fa-taco'
    }
  ];
}
