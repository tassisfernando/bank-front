import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { BackButton } from '../../../../shared/components/back-button/back-button';
import { Account } from '../../../../shared/models/account.model';
import { getTransactionTypeDescription, TransactionType } from '../../../../shared/enums/transactionType.enum';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../../accounts/services/account.service';
import { TokenService } from '../../../../core/services/token.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';
import { StatementResponse } from '../../../../shared/models/statement.model';

@Component({
  selector: 'app-statement',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, BackButton],
  templateUrl: './statement.html',
  styleUrls: ['./statement.scss']
})
export class StatementComponent implements OnInit {
  accounts: Account[] = [];
  selectedAccount: string = '';
  statements: StatementResponse[] = [];
  currentBalance: number = 0;
  errorMessage: string = '';
  isLoading: boolean = false;
  isLoadingAccounts: boolean = false;
  hasSearched: boolean = false;
  customerId: string = '';

  TransactionType = TransactionType;

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private tokenService: TokenService,
    private errorHandler: ErrorHandlerService
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
        this.errorMessage = this.errorHandler.handleStatementError(error);
        this.isLoadingAccounts = false;
      }
    });
  }

  loadStatement() {
    if (!this.selectedAccount) {
      this.errorMessage = 'Selecione uma conta';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.hasSearched = true;

    this.transactionService.getStatementByAccount(this.selectedAccount, this.customerId).subscribe({
      next: (statements) => {
        this.statements = statements.sort((a, b) => 
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        
        // Busca o saldo atual da conta selecionada
        const selectedAccountData = this.accounts.find(acc => acc.accountNumber === this.selectedAccount);
        this.currentBalance = selectedAccountData?.balance || 0;
        
        this.isLoading = false;
        console.log('Statements loaded:', this.statements);
      },
      error: (error) => {
        console.error('Error loading statements:', error);
        this.errorMessage = this.errorHandler.handleHttpError(error);
        this.statements = [];
        this.isLoading = false;
      }
    });
  }

  getTypeDescription(type: TransactionType): string {
    return getTransactionTypeDescription(type);
  }

  retryLoadAccounts() {
    this.loadAccounts();
  }
}