import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  password = '';
  role = 'cliente'; // por defecto

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    try {
      const cred = await this.authService.register(this.email, this.password, this.role as 'admin' | 'cliente');
      console.log('Registro correcto', cred);
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Error en registro', err);
    }
  }
}
