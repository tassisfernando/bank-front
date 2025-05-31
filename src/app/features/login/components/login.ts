import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { cpfIsValid } from '../../../shared/utils/validators';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  customer = {
    cpf: '',
    password: ''
  };
  errorMessage = '';

  constructor(
    private router: Router, 
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  createAccount() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    this.errorMessage = '';
    if (!this.cpfIsValidField()) {
      this.errorMessage = 'CPF inválido';
      return;
    }
    if (!this.customer.password) {
      this.errorMessage = 'Senha obrigatória';
      return;
    }

    this.authService.login(this.customer.cpf, this.customer.password).subscribe({
      next: (response) => {
        // Salva o token na sessão
        this.tokenService.saveToken(response.token);
        this.tokenService.saveUserName(response.name);
        // Redireciona para o dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'CPF ou senha incorretos';
      }
    });
  }

  cpfIsValidField(): boolean {
    return cpfIsValid(this.customer.cpf);
  }
}