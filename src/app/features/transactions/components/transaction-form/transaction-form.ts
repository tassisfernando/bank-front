import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { BackButton } from '../../../../shared/components/back-button/back-button';
import { TransactionData } from '../../../../shared/models/transactionData.model';
import { Account } from '../../../../shared/models/account.model';
import { AccountService } from '../../../accounts/services/account.service';
import { TokenService } from '../../../../core/services/token.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, BackButton],
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.scss']
})
export class TransactionFormComponent implements OnInit {
  @Input() title: string = 'Transação';
  @Input() confirmButtonText: string = 'Confirmar';
  @Input() backButtonText: string = 'Voltar ao Menu';
  @Input() transactionType: 'withdraw' | 'deposit' = 'withdraw';

  accounts: Account[] = [];
  selectedAccount: string = '';
  amount: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isLoadingAccounts: boolean = false;
  customerId: string = '';

  constructor(private router: Router, 
    private accountService: AccountService,
    private tokenService: TokenService,
    private errorHandler: ErrorHandlerService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.customerId = this.tokenService.getUserId() || '';
    this.loadAccounts();
  }

  loadAccounts() {
    this.isLoadingAccounts = true;
    this.errorMessage = ''; 
    
    if (!this.customerId) {
      console.error('Customer ID not found in token service');
      this.accounts = [];
      this.errorMessage = 'Erro: ID do cliente não encontrado';
      this.isLoadingAccounts = false;
      return;
    }

    this.accountService.getAccounts(this.customerId).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.isLoadingAccounts = false; 
        console.log('Accounts loaded:', this.accounts);
      },
      error: (error) => {
        this.accounts = [];
        this.errorMessage = this.errorHandler.handleAccountError(error);
        this.isLoadingAccounts = false; 
      }
    });
  }

  onSubmit(form: any) {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.valid && this.validateTransaction()) {
      this.isLoading = true;
      
      const transactionData: TransactionData = {
        accountNumberOrigin: this.selectedAccount,
        amount: this.amount!
      };

      const transaction$ = this.transactionType === 'deposit' 
        ? this.transactionService.deposit(transactionData, this.customerId)
        : this.transactionService.withdraw(transactionData, this.customerId);

      transaction$.subscribe({
        next: (response) => {
          console.log('Transação realizada com sucesso:', response);
          this.successMessage = response.message || `${this.transactionType === 'withdraw' ? 'Saque' : 'Depósito'} realizado com sucesso!`;
          this.isLoading = false;
          
          if (response.newBalance !== undefined) {
            this.updateAccountBalance(response.newBalance);
          }
          
          this.resetForm();
          
          // Redireciona após sucesso
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erro na transação:', error);
          this.errorMessage = this.errorHandler.handleTransactionError(error);
          this.isLoading = false;
        }
      });
    }
  }

  updateAccountBalance(newBalance: number) {
    const accountIndex = this.accounts.findIndex(acc => acc.accountNumber === this.selectedAccount);
    if (accountIndex !== -1) {
      this.accounts[accountIndex].balance = newBalance;
    }
  }

  validateTransaction(): boolean {
    if (!this.selectedAccount || !this.amount) {
      return false;
    }

    const selectedAccountData = this.accounts.find(acc => acc.accountNumber === this.selectedAccount);
    
    if (!selectedAccountData) {
      this.errorMessage = 'Conta não encontrada';
      return false;
    }

    if (this.transactionType === 'withdraw') {
      const availableBalance = this.getAvailableBalance(selectedAccountData);
      
      if (this.amount > availableBalance) {
        this.errorMessage = `Valor indisponível. Disponível: ${this.formatCurrency(availableBalance)} (Saldo: ${this.formatCurrency(selectedAccountData.balance)} + Limite: ${this.formatCurrency(selectedAccountData.creditLimit || 0)})`;
        return false;
      }
    }

    if (this.amount <= 0) {
      this.errorMessage = 'O valor deve ser maior que zero';
      return false;
    }

    if (this.amount > 10000) {
      this.errorMessage = 'Valor máximo por transação: R$ 10.000,00';
      return false;
    }

    return true;
  }

  getAvailableBalance(account: Account): number {
    return account.balance + (account.creditLimit || 0);
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

  getAvailableBalanceForSelectedAccount(): number {
    const account = this.getSelectedAccountInfo();
    return account ? this.getAvailableBalance(account) : 0;
  }

  resetForm() {
    this.selectedAccount = '';
    this.amount = null;
  }

  retryLoadAccounts() {
    this.loadAccounts();
  }
}