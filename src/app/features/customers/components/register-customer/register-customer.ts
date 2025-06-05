import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../../../../shared/models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';
import { FormHelperService } from '../../../../shared/services/form-helper.service';

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
    private errorHandler: ErrorHandlerService,
    private formHelper: FormHelperService
  ) {}

  // Métodos delegados para o FormHelperService
  onCpfInput(event: any) {
    this.formHelper.onCpfInput(event, (value) => {
      this.customer.cpf = value;
    });
  }

  onPhoneInput(event: any) {
    this.formHelper.onPhoneInput(event, (value) => {
      this.customer.telephone = value;
    });
  }

  onKeyPress(event: KeyboardEvent): boolean {
    return this.formHelper.onKeyPress(event);
  }

  cpfIsValidField(): boolean {
    return this.formHelper.validateCpf(this.customer.cpf);
  }

  passwordsMatch(): boolean {
    return this.formHelper.validatePasswordMatch(this.customer.password, this.confirmPassword).valid;
  }

  onSubmit(form: any) {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateForm(form)) {
      return;
    }

    this.isLoading = true;

    const cleanCustomer: Customer = {
      ...this.customer,
      cpf: this.formHelper.cleanNumericField(this.customer.cpf),
      telephone: this.formHelper.cleanNumericField(this.customer.telephone)
    };

    this.customerService.registerCustomer(cleanCustomer).subscribe({
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

    const passwordValidation = this.formHelper.validatePassword(this.customer.password);
    if (!passwordValidation.valid) {
      this.errorMessage = passwordValidation.message!;
      return false;
    }

    const passwordMatchValidation = this.formHelper.validatePasswordMatch(this.customer.password, this.confirmPassword);
    if (!passwordMatchValidation.valid) {
      this.errorMessage = passwordMatchValidation.message!;
      return false;
    }

    return true;
  }

  goBackToLogin() {
    this.router.navigate(['']);
  }
}