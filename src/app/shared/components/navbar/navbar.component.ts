import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SearchBarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms 200ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit {
  isOpen = false;
  isUserDropdownOpen = false;
  isLoggedIn = false;
  userName = 'Juan Pérez';

  navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'fas fa-chart-line' },
    { label: 'Menú', path: '/menu', icon: 'fas fa-utensils' },
    { label: 'Reservas', path: '/reservas', icon: 'fas fa-calendar' },
    { label: 'Pedidos', path: '/pedidos', icon: 'fas fa-shopping-cart' },
  ];

  ngOnInit() {
    // Simular que el usuario está logueado
    this.isLoggedIn = true;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  logout() {
    // Lógica de logout
    this.isLoggedIn = false;
    this.isUserDropdownOpen = false;
  }
}
