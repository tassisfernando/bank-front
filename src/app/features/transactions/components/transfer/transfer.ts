import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { BackButton } from '../../../../shared/components/back-button/back-button';
import { AccountService } from '../../../accounts/services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { TokenService } from '../../../../core/services/token.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';
import { Account } from '../../../../shared/models/account.model';
import { TransferRequest } from '../../../../shared/models/transferRequest.model';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, BackButton],
  templateUrl: './transfer.html',
  styleUrls: ['./transfer.scss']
})
export class TransferComponent implements OnInit {
  accounts: Account[] = [];
  selectedAccount: string = '';
  destinationAccount: string = '';
  amount: number | null = null;
  
  customerId: string = '';
  isLoading: boolean = false;
  isLoadingAccounts: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.customerId = this.tokenService.getUserId() || '';
    this.loadAccounts();
  }

  loadAccounts() {
    if (!this.customerId) {
      this.errorMessage = 'Erro: ID do cliente não encontrado';
      return;
    }

    this.isLoadingAccounts = true;
    this.errorMessage = '';

    this.accountService.getAccounts(this.customerId).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.isLoadingAccounts = false;
        console.log('Accounts loaded for transfer:', this.accounts);
      },
      error: (error) => {
        this.errorMessage = this.errorHandler.handleAccountError(error);
        this.isLoadingAccounts = false;
        console.error('Error loading accounts:', error);
      }
    });
  }

  onSubmit(form: any) {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.valid && this.validateTransfer()) {
      this.isLoading = true;
      
      const transferData: TransferRequest = {
        accountNumberOrigin: this.selectedAccount,
        accountNumberDestin: this.destinationAccount.trim(),
        amount: this.amount!
      };

      this.transactionService.transfer(transferData, this.customerId).subscribe({
        next: (response) => {
          console.log('Transferência realizada com sucesso:', response);
          this.successMessage = response.message || 'Transferência realizada com sucesso!';
          this.isLoading = false;
          this.resetForm();
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erro na transferência:', error);
          this.errorMessage = this.errorHandler.handleTransactionError(error);
          this.isLoading = false;
        }
      });
    }
  }

  validateTransfer(): boolean {
    if (!this.selectedAccount || !this.destinationAccount || !this.amount) {
      return false;
    }

    const selectedAccountData = this.accounts.find(acc => acc.accountNumber === this.selectedAccount);
    if (!selectedAccountData) {
      this.errorMessage = 'Conta de origem não encontrada';
      return false;
    }

    if (this.destinationAccount.trim().length < 5) {
      this.errorMessage = 'Conta de destino deve ter pelo menos 5 caracteres';
      return false;
    }

    if (this.selectedAccount === this.destinationAccount.trim()) {
      this.errorMessage = 'Não é possível transferir para a mesma conta';
      return false;
    }

    if (this.amount <= 0) {
      this.errorMessage = 'O valor deve ser maior que zero';
      return false;
    }

    if (this.amount > 50000) {
      this.errorMessage = 'Valor máximo por transferência: R$ 50.000,00';
      return false;
    }

    const availableBalance = this.getAvailableBalance(selectedAccountData);
    if (this.amount > availableBalance) {
      this.errorMessage = `Valor indisponível. Disponível: ${this.formatCurrency(availableBalance)}`;
      return false;
    }

    return true;
  }

  isSameAccount(): boolean {
    if (!this.selectedAccount || !this.destinationAccount) {
      return false;
    }
    return this.selectedAccount === this.destinationAccount.trim();
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
    this.destinationAccount = '';
    this.amount = null;
  }

  retryLoadAccounts() {
    this.loadAccounts();
  }

}