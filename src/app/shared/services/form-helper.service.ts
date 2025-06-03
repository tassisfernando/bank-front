import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormHelperService {

  constructor() {}

  // Método para permitir apenas números no CPF
  onCpfInput(event: any, callback: (value: string) => void) {
    let value = event.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    // Limita a 11 dígitos
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Aplica máscara do CPF
    const maskedValue = this.maskCpf(value);
    callback(maskedValue);
  }

  // Método para permitir apenas números no telefone
  onPhoneInput(event: any, callback: (value: string) => void) {
    let value = event.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    // Limita a 11 dígitos (celular com DDD)
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Aplica máscara do telefone
    const maskedValue = this.maskPhone(value);
    callback(maskedValue);
  }

  // Previne entrada de caracteres não numéricos
  onKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    
    // Permite apenas números (0-9), backspace (8), delete (46), tab (9), escape (27), enter (13)
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    
    return true;
  }

  // Máscara de CPF
  private maskCpf(value: string): string {
    value = value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    return value;
  }

  // Máscara de telefone
  private maskPhone(value: string): string {
    value = value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length <= 2) {
        value = value.replace(/(\d{0,2})/, '($1');
      } else if (value.length <= 6) {
        value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
      } else if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
    }
    
    return value;
  }

  // Validação de CPF
  validateCpf(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }
    
    let sum = 0;
    let remainder;
    
    // Valida primeiro dígito
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
    sum = 0;
    // Valida segundo dígito
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }

  // Validação de senha
  validatePassword(password: string, minLength: number = 6): { valid: boolean, message?: string } {
    if (!password) {
      return { valid: false, message: 'Senha é obrigatória' };
    }
    
    if (password.length < minLength) {
      return { valid: false, message: `Senha deve ter pelo menos ${minLength} caracteres` };
    }
    
    return { valid: true };
  }

  // Validação de confirmação de senha
  validatePasswordMatch(password: string, confirmPassword: string): { valid: boolean, message?: string } {
    if (password !== confirmPassword) {
      return { valid: false, message: 'As senhas não coincidem' };
    }
    
    return { valid: true };
  }
}