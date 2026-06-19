import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ForgotPasswordComponent {
  forgotForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  step: 'email' | 'code' | 'reset' = 'email';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initForm();
  }

  initForm() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmitEmail() {
    if (this.forgotForm.get('email')?.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Código enviado a tu email. Revisa tu bandeja de entrada.';
        this.step = 'code';
      }, 1500);
    }
  }

  onSubmitCode() {
    if (this.forgotForm.get('code')?.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Código verificado. Ahora ingresa tu nueva contraseña.';
        this.step = 'reset';
      }, 1500);
    }
  }

  onSubmitReset() {
    const pwd = this.forgotForm.get('newPassword')?.value;
    const confirm = this.forgotForm.get('confirmPassword')?.value;

    if (pwd !== confirm) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.forgotForm.get('newPassword')?.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = '¡Contraseña restablecida exitosamente! Redirigiendo al login...';
        
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      }, 1500);
    }
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }

  get email() {
    return this.forgotForm.get('email');
  }

  get code() {
    return this.forgotForm.get('code');
  }

  get newPassword() {
    return this.forgotForm.get('newPassword');
  }

  get confirmPassword() {
    return this.forgotForm.get('confirmPassword');
  }
}
