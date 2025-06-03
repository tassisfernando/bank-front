import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { cpfIsValid, maskPhone } from '../../../../shared/utils/validators';
import { Customer } from '../../../../shared/models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';

@Component({
  selector: 'app-register-customer',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-customer.html',
  styleUrl: './register-customer.scss'
})
export class RegisterCustomer {
  customer: Customer = {
    name: '',
    cpf: '',
    telephone: '',
    password: ''
  };

  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private errorHandler: ErrorHandlerService
  ) {}

  passwordsMatch(): boolean {
    return this.customer.password === this.confirmPassword && this.customer.password !== '';
  }

  onSubmit(form: any) {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateForm(form)) {
      return;
    }

    this.isLoading = true;

    this.customerService.registerCustomer(this.customer).subscribe({
      next: (response) => {
        console.log('Customer registered successfully:', response);
        this.successMessage = 'Conta criada com sucesso!';
        this.isLoading = false;
        
        setTimeout(() => {
          this.goBackToLogin();
        }, 2000);
      },
      error: (error) => {
        console.error('Error registering customer:', error);
        this.errorMessage = this.errorHandler.handleRegistrationError(error);
        this.isLoading = false;
      }
    });
  }

  validateForm(form: any): boolean {
    if (!form.valid) {
      this.errorMessage = 'Preencha todos os campos obrigatórios';
      return false;
    }

    if (!this.cpfIsValidField()) {
      this.errorMessage = 'CPF inválido';
      return false;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage = 'As senhas não coincidem';
      return false;
    }

    if (this.customer.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      return false;
    }

    return true;
  }

  goBackToLogin() {
    this.router.navigate(['']);
  }

  onPhoneInput() {
    this.customer.telephone = maskPhone(this.customer.telephone);
  }

  cpfIsValidField(): boolean {
    return cpfIsValid(this.customer.cpf);
  }
}