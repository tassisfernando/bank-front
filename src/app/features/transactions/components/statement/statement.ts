import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { BackButton } from '../../../../shared/components/back-button/back-button';
import { Account } from '../../../../shared/models/account.model';
import { getTransactionTypeDescription, translateTransactionType, TransactionType } from '../../../../shared/enums/transactionType.enum';
import { getOperationTypeClass, translateOperation } from '../../../../shared/enums/operationType.enum';
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

  getTransactionTypeForAccount(statement: StatementResponse): 'credit' | 'debit' {
    const isOriginAccount = statement.accountNumberOrigin === this.selectedAccount;
    const isDestinationAccount = statement.accountNumberDestin === this.selectedAccount;
    
    if (isDestinationAccount && !isOriginAccount) {
      return 'credit';
    }
    
    if (isOriginAccount && !isDestinationAccount) {
      return 'debit';
    }
    
    if (isOriginAccount && isDestinationAccount) {
      const operation = translateOperation(statement.operation).toLowerCase();
      
      if (['depósito', 'bônus'].includes(operation)) {
        return 'credit';
      }
      
      if (['saque', 'taxa'].includes(operation)) {
        return 'debit';
      }
    }
    
    if (typeof statement.type === 'string') {
      const normalizedType = statement.type.trim().toUpperCase();
      return ['CREDIT', 'CREDITO', 'C'].includes(normalizedType) ? 'credit' : 'debit';
    }
    
    return statement.type === TransactionType.CREDIT ? 'credit' : 'debit';
  }

  getTypeDescription(statement: StatementResponse): string {
    const accountType = this.getTransactionTypeForAccount(statement);
    return accountType === 'credit' ? 'Crédito' : 'Débito';
  }

  isCreditTransaction(statement: StatementResponse): boolean {
    return this.getTransactionTypeForAccount(statement) === 'credit';
  }

  getOperationClass(operation: string): string {
    return getOperationTypeClass(operation);
  }

  getOperationText(operation: string): string {
    return translateOperation(operation);
  }

  retryLoadAccounts() {
    this.loadAccounts();
  }
}