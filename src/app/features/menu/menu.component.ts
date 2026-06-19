import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { MenuService } from '@core/services/menu.service';
import { MenuItem, CartItem } from '@database/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div @fadeIn class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Menu Items -->
        <div class="lg:col-span-2">
          <div class="mb-8 animate-slide-up">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Menú del Día</h1>
            <p class="text-gray-600">Selecciona tu almuerzo favorito</p>
          </div>

          <!-- Search & Filter -->
          <div class="mb-8 space-y-4 animate-slide-up" style="animation-delay: 100ms;">
            <input type="text" 
              [(ngModel)]="searchTerm"
              placeholder="Buscar en el menú..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            
            <div class="flex flex-wrap gap-2">
              <button *ngFor="let filter of filters" 
                (click)="selectFilter(filter)"
                class="px-4 py-2 rounded-full transition-all duration-300 font-medium"
                [class]="filter === activeFilter ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'">
                {{ filter }}
              </button>
            </div>
          </div>

          <!-- Menu Items Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style="animation-delay: 200ms;">
            <div *ngFor="let item of filteredItems; let i = index"
              class="card group hover:shadow-xl animate-scale-in"
              [style.animation-delay]="(i * 50) + 'ms'">
              <div class="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg mb-4 flex items-center justify-center">
                <i [class]="'text-6xl text-blue-400 opacity-50'"></i>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Sin menú activo</h3>
              <p class="text-gray-600 text-sm mb-4">Esperando datos del servidor</p>
              <div class="flex items-center justify-between mb-4">
                <span class="text-2xl font-bold text-blue-600">\$0.00</span>
              </div>
              <button (click)="addToCart(item)" class="btn btn-primary w-full">
                <i class="fas fa-shopping-cart"></i>
                Agregar al Carrito
              </button>
            </div>

            <!-- Empty State -->
            <div *ngIf="filteredItems.length === 0" class="col-span-full text-center py-16">
              <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
              <p class="text-gray-600">No hay items disponibles</p>
            </div>
          </div>
        </div>

        <!-- Carrito -->
        <div class="lg:col-span-1 animate-slide-up" style="animation-delay: 300ms;">
          <div class="card sticky top-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-shopping-cart text-blue-600"></i>
              Carrito
            </h2>

            <div *ngIf="cartItems.length > 0" class="space-y-4 mb-4 max-h-96 overflow-y-auto">
              <div *ngFor="let item of cartItems" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900">{{ item.name }}</p>
                  <p class="text-sm text-gray-600">\${{ item.price }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="updateQuantity(item.id, item.quantity - 1)" class="w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded hover:bg-red-200">-</button>
                  <span class="w-6 text-center font-medium">{{ item.quantity }}</span>
                  <button (click)="updateQuantity(item.id, item.quantity + 1)" class="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded hover:bg-green-200">+</button>
                </div>
              </div>
            </div>

            <div *ngIf="cartItems.length === 0" class="text-center py-8 text-gray-500">
              <i class="fas fa-shopping-bag text-4xl mb-2 opacity-30"></i>
              <p>Carrito vacío</p>
            </div>

            <!-- Cart Total -->
            <div class="border-t border-gray-200 pt-4 mt-4">
              <div class="flex justify-between mb-4">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-bold">\${{ cartTotal }}</span>
              </div>
              <button (click)="checkout()" 
                [disabled]="cartItems.length === 0"
                class="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-credit-card"></i>
                Hacer Pedido
              </button>
              <button (click)="clearCart()" 
                [disabled]="cartItems.length === 0"
                class="btn btn-outline w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Limpiar Carrito
              </button>
            </div>
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
export class MenuComponent implements OnInit {
  filters = ['Todos', 'Carnes', 'Vegetarianos', 'Pescados', 'Bajo Calorías'];
  activeFilter = 'Todos';
  searchTerm = '';
  
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  cartItems: CartItem[] = [];
  cartTotal: number = 0;

  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    this.menuService.menuItems$.subscribe(items => {
      this.menuItems = items;
      this.filterItems();
    });

    this.menuService.cart$.subscribe(cart => {
      this.cartItems = cart;
    });

    this.menuService.cartTotal$.subscribe(total => {
      this.cartTotal = parseFloat(total.toFixed(2));
    });
  }

  selectFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterItems();
  }

  filterItems(): void {
    let filtered = this.menuItems;

    if (this.activeFilter !== 'Todos') {
      filtered = filtered.filter(item => 
        item.category === this.activeFilter.toLowerCase().replace(' ', '-')
      );
    }

    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredItems = filtered;
  }

  addToCart(item: MenuItem): void {
    this.menuService.addToCart(item);
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.menuService.updateQuantity(itemId, quantity);
  }

  clearCart(): void {
    this.menuService.clearCart();
  }

  checkout(): void {
    this.router.navigate(['/pedidos']);
  }
}
