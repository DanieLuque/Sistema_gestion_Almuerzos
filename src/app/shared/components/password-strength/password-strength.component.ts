import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-2">
      <div class="flex items-center gap-2 mb-2">
        <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-300"
            [class]="strengthClass"
            [style.width.%]="strength"></div>
        </div>
        <span class="text-xs font-semibold px-2 py-1 rounded-full" [ngClass]="strengthBadgeClass">
          {{ strengthLabel }}
        </span>
      </div>
      
      <!-- Requirements -->
      <div class="space-y-1 text-xs">
        <div class="flex items-center gap-2" [class.text-green-600]="(password || '').length >= 8" [class.text-gray-400]="!password || (password || '').length < 8">
          <i [class]="(password || '').length >= 8 ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
          <span>Mínimo 8 caracteres</span>
        </div>
        <div class="flex items-center gap-2" [class.text-green-600]="hasUppercase" [class.text-gray-400]="!hasUppercase">
          <i [class]="hasUppercase ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
          <span>Mayúscula (A-Z)</span>
        </div>
        <div class="flex items-center gap-2" [class.text-green-600]="hasNumber" [class.text-gray-400]="!hasNumber">
          <i [class]="hasNumber ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
          <span>Número (0-9)</span>
        </div>
        <div class="flex items-center gap-2" [class.text-green-600]="hasSpecialChar" [class.text-gray-400]="!hasSpecialChar">
          <i [class]="hasSpecialChar ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
          <span>Carácter especial (!&#64;#$%)</span>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(10px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class PasswordStrengthComponent {
  @Input() password: string = '';

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.password);
  }

  get hasSpecialChar(): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.password);
  }

  get strength(): number {
    let score = 0;
    const pwd = this.password || '';
    if (pwd.length >= 8) score += 25;
    if (pwd.length >= 12) score += 25;
    if (this.hasUppercase) score += 15;
    if (this.hasNumber) score += 15;
    if (this.hasSpecialChar) score += 20;
    return Math.min(score, 100);
  }

  get strengthLabel(): string {
    if (this.strength < 25) return 'Muy débil';
    if (this.strength < 50) return 'Débil';
    if (this.strength < 75) return 'Buena';
    return 'Excelente';
  }

  get strengthClass(): string {
    if (this.strength < 25) return 'bg-red-500';
    if (this.strength < 50) return 'bg-orange-500';
    if (this.strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  get strengthBadgeClass(): string {
    if (this.strength < 25) return 'bg-red-100 text-red-700';
    if (this.strength < 50) return 'bg-orange-100 text-orange-700';
    if (this.strength < 75) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  }
}
