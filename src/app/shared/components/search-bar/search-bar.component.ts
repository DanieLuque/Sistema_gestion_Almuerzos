import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative max-w-2xl mx-auto">
      <div class="relative">
        <i class="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
        <input 
          [(ngModel)]="searchTerm"
          (keyup.enter)="search()"
          placeholder="Buscar menú, pedidos, reservas..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
        <button *ngIf="searchTerm" (click)="clearSearch()" class="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Search Results Dropdown -->
      <div *ngIf="showResults && searchResults.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
        <div *ngFor="let result of searchResults" class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0" (click)="selectResult(result)">
          <div class="flex items-center gap-3">
            <i [class]="result.icon + ' text-blue-600'"></i>
            <div>
              <p class="font-medium text-gray-900">{{ result.name }}</p>
              <p class="text-sm text-gray-600">{{ result.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SearchBarComponent {
  searchTerm = '';
  showResults = false;
  searchResults: any[] = [];

  constructor(private router: Router) {}

  search(): void {
    if (this.searchTerm.trim()) {
      // Búsqueda global simple
      this.searchResults = [];
      
      if (this.searchTerm.toLowerCase().includes('menú') || this.searchTerm.toLowerCase().includes('menu')) {
        this.searchResults.push({
          icon: 'fas fa-utensils',
          name: 'Ir al Menú',
          description: 'Ver menú del día',
          route: '/menu'
        });
      }

      if (this.searchTerm.toLowerCase().includes('pedidos') || this.searchTerm.toLowerCase().includes('pedido')) {
        this.searchResults.push({
          icon: 'fas fa-shopping-bag',
          name: 'Mis Pedidos',
          description: 'Ver historial de pedidos',
          route: '/pedidos'
        });
      }

      if (this.searchTerm.toLowerCase().includes('reserva')) {
        this.searchResults.push({
          icon: 'fas fa-calendar',
          name: 'Mis Reservas',
          description: 'Ver reservas de almuerzos',
          route: '/reservas'
        });
      }

      this.showResults = true;
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.showResults = false;
  }

  selectResult(result: any): void {
    this.router.navigate([result.route]);
    this.clearSearch();
  }
}
