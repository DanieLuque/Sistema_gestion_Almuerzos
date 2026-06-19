import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';
import { TermsModalComponent } from '@shared/components/terms-modal/terms-modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PasswordStrengthComponent, TermsModalComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(50px)', opacity: 0 }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showTermsModal = false;

  @ViewChild(PasswordStrengthComponent) passwordStrength!: PasswordStrengthComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      // Simulación de registro
      setTimeout(() => {
        this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
        this.isLoading = false;
        
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      }, 1500);
    } else {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
    }
  }

  get fullName() {
    return this.registerForm.get('fullName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  openTermsModal() {
    this.showTermsModal = true;
  }

  acceptTerms() {
    this.registerForm.patchValue({ terms: true });
    this.showTermsModal = false;
  }

  closeTermsModal() {
    this.showTermsModal = false;
  }

  get terms() {
    return this.registerForm.get('terms');
  }
}
