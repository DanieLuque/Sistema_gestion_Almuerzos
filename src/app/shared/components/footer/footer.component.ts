import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  links = [
    { label: 'Sobre Nosotros', url: '#' },
    { label: 'Política de Privacidad', url: '#' },
    { label: 'Términos de Servicio', url: '#' },
    { label: 'Contacto', url: '#' }
  ];

  social = [
    { icon: 'fab fa-facebook', url: '#' },
    { icon: 'fab fa-twitter', url: '#' },
    { icon: 'fab fa-linkedin', url: '#' },
    { icon: 'fab fa-instagram', url: '#' }
  ];
}
