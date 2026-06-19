import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-50px)', opacity: 0 }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Simulación de login
      setTimeout(() => {
        // localStorage.setItem('token', 'fake-token-12345');
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
