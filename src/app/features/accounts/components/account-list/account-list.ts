import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { BackButton } from '../../../../shared/components/back-button/back-button';
import { CreditLimitFormComponent } from '../credit-limit-form/credit-limit-form';
import { AccountService } from '../../services/account.service';
import { TokenService } from '../../../../core/services/token.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';
import { Account } from '../../../../shared/models/account.model';
import { AccountRequest } from '../../../../shared/models/accountRequest.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BackButton, CreditLimitFormComponent],
  templateUrl: './account-list.html',
  styleUrls: ['./account-list.scss']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  customerId: string = '';
  customerName: string = '';

  constructor(
    private accountService: AccountService,
    private tokenService: TokenService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.customerId = this.tokenService.getUserId() || '';
    this.customerName = this.tokenService.getUserName() || '';
    this.loadAccounts();
  }

  loadAccounts() {
    this.isLoading = true;
    this.errorMessage = ''; 
    if (!this.customerId) {
      console.error('Customer ID not found in token service');
      this.accounts = [];
      this.errorMessage = 'Erro: ID do cliente não encontrado';
      this.isLoading = false;
      return;
    }

    this.accountService.getAccounts(this.customerId).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.isLoading = false; 
        console.log('Accounts loaded:', this.accounts);
      },
      error: (error) => {
        this.accounts = [];
        this.errorMessage = this.errorHandler.handleAccountError(error);
        this.isLoading = false; 
      }
    });
  }

  createNewAccount() {
    this.isLoading = true;
    this.errorMessage = '';
  
    const accountRequest: AccountRequest = { 
      customer_id: this.customerId, 
      customer_name: this.customerName 
    };

    this.accountService.createAccount(accountRequest).subscribe({
      next: (newAccount) => {
        this.accounts.push(newAccount);
        console.log('New account created:', newAccount);
      },
      error: (error) => {
        this.errorMessage = this.errorHandler.handleAccountError(error);
        console.error('Error creating new account:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  retryLoadAccounts() {
    this.loadAccounts();
  }

  // Método chamado quando o limite de crédito é atualizado
  onCreditLimitUpdated() {
    this.loadAccounts(); // Recarrega as contas para mostrar o novo limite
  }
}