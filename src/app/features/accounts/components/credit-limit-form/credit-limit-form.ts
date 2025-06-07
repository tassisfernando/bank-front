import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from '../../../../shared/models/account.model';
import { AccountService } from '../../services/account.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';
import { CreditLimitRequest } from '../../../../shared/models/creditLimitRequest.model';

@Component({
  selector: 'app-credit-limit-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-limit-form.html',
  styleUrls: ['./credit-limit-form.scss']
})
export class CreditLimitFormComponent implements OnInit {
  @Input() accounts: Account[] = [];
  @Output() creditLimitUpdated = new EventEmitter<void>();

  selectedAccount: string = '';
  newCreditLimit: number | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private accountService: AccountService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    // Limpa as mensagens quando o componente é inicializado
    this.clearMessages();
  }

  onSubmit(form: any) {
    this.clearMessages();

    if (!this.validateForm(form)) {
      return;
    }

    this.isLoading = true;

    const creditLimitRequest: CreditLimitRequest = {
      accountNumber: this.selectedAccount,
      creditLimit: this.newCreditLimit!
    };

    this.accountService.updateCreditLimit(creditLimitRequest).subscribe({
      next: (response) => {
        console.log('Credit limit updated successfully:', response);
        
        // Corrigido: usar newCreditLimit ao invés de creditLimit
        this.successMessage = `Limite de crédito alterado para ${this.formatCurrency(response.creditLimit)} na conta ${response.accountNumber}`;
        this.isLoading = false;
        this.resetForm();
        
        // Emite evento para o componente pai atualizar a lista
        this.creditLimitUpdated.emit();
        
        // Remove a mensagem de sucesso após 5 segundos (aumentei o tempo)
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('Error updating credit limit:', error);
        this.errorMessage = this.errorHandler.handleAccountError(error);
        this.isLoading = false;
      }
    });
  }

  validateForm(form: any): boolean {
    if (!form.valid) {
      this.errorMessage = 'Preencha todos os campos obrigatórios';
      return false;
    }

    if (!this.selectedAccount) {
      this.errorMessage = 'Selecione uma conta';
      return false;
    }

    if (this.newCreditLimit === null || this.newCreditLimit < 0) {
      this.errorMessage = 'O limite de crédito deve ser um valor positivo';
      return false;
    }

    if (this.newCreditLimit > 50000) {
      this.errorMessage = 'O limite de crédito não pode exceder R$ 50.000,00';
      return false;
    }

    const selectedAccountInfo = this.getSelectedAccountInfo();
    if (selectedAccountInfo && selectedAccountInfo.creditLimit !== undefined) {
      if (this.newCreditLimit <= selectedAccountInfo.creditLimit) {
        this.errorMessage = `O novo limite deve ser maior que o atual (${this.formatCurrency(selectedAccountInfo.creditLimit)})`;
        return false;
      }
    }

    return true;
  }

  resetForm() {
    this.selectedAccount = '';
    this.newCreditLimit = null;
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getSelectedAccountInfo(): Account | undefined {
    return this.accounts.find(acc => acc.accountNumber === this.selectedAccount);
  }

  getCurrentCreditLimit(): string {
    const account = this.getSelectedAccountInfo();
    return account?.creditLimit ? this.formatCurrency(account.creditLimit) : 'Não informado';
  }

  isValidNewLimit(): boolean {
    if (!this.selectedAccount || this.newCreditLimit === null) {
      return false;
    }

    const selectedAccountInfo = this.getSelectedAccountInfo();
    if (selectedAccountInfo && selectedAccountInfo.creditLimit !== undefined) {
      return this.newCreditLimit > selectedAccountInfo.creditLimit;
    }

    return this.newCreditLimit > 0;
  }

  getMinimumAllowedLimit(): number {
    const selectedAccountInfo = this.getSelectedAccountInfo();
    if (selectedAccountInfo && selectedAccountInfo.creditLimit !== undefined) {
      return selectedAccountInfo.creditLimit + 0.01; // Mínimo é o atual + 1 centavo
    }
    return 0.01;
  }
}