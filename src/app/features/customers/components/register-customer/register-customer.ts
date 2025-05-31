import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { cpfIsValid, maskPhone } from '../../../../shared/utils/validators';

@Component({
  selector: 'app-register-customer',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-customer.html',
  styleUrl: './register-customer.scss'
})
export class RegisterCustomer {
  customer = {
    name: '',
    cpf: '',
    phone: '',
    password: ''
  };

  confirmPassword = '';

  constructor(private router: Router) {}

  passwordsMatch(): boolean {
    return this.customer.password === this.confirmPassword && this.customer.password !== '';
  }

  onSubmit(form: any) {
    if (form.valid && this.passwordsMatch()) {
      console.log('Customer data:', this.customer);
      // Register logic here
      alert('Conta criada com sucesso!');
      this.goBackToLogin();
    }
  }

  goBackToLogin() {
    this.router.navigate(['']);
  }

  onPhoneInput() {
      this.customer.phone = maskPhone(this.customer.phone);
  }

  cpfIsValidField(): boolean {
      return cpfIsValid(this.customer.cpf);
  }
}