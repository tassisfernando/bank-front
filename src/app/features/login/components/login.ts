import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../core/services/token.service';
import { AuthResponse } from '../../../shared/models/authResponse.model';
import { Auth } from '../../../shared/models/auth.model';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { FormHelperService } from '../../../shared/services/form-helper.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  customer: Auth = {
    cpf: '',
    password: ''
  };
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private tokenService: TokenService,
    private errorHandler: ErrorHandlerService,
    private formHelper: FormHelperService
  ) {}

  // Métodos delegados para o FormHelperService
  onCpfInput(event: any) {
    this.formHelper.onCpfInput(event, (value) => {
      this.customer.cpf = value;
    });
  }

  onKeyPress(event: KeyboardEvent): boolean {
    return this.formHelper.onKeyPress(event);
  }

  cpfIsValidField(): boolean {
    return this.formHelper.validateCpf(this.customer.cpf);
  }

  createAccount() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    const loginData: Auth = {
      cpf: this.formHelper.cleanNumericField(this.customer.cpf),
      password: this.customer.password
    };

    this.authService.login(loginData).subscribe({
      next: (response: AuthResponse) => {
        this.tokenService.saveToken(response.token);
        this.tokenService.saveUserName(response.name);
        this.tokenService.saveUserId(response.user_id);
        
        this.isLoading = false; 
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = this.errorHandler.handleAuthError(err);
        this.isLoading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.cpfIsValidField()) {
      this.errorMessage = 'CPF inválido';
      return false;
    }
    
    if (!this.customer.password) {
      this.errorMessage = 'Senha obrigatória';
      return false;
    }

    return true;
  }
}