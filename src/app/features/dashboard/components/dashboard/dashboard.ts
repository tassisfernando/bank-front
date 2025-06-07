import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../../../core/services/token.service';
import { AuthService } from '../../../login/services/auth.service';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { CustomerService } from '../../../customers/services/customer.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  totalBalance: number = 0;
  isLoadingBalance: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private customerService: CustomerService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.userName = this.tokenService.getUserName() || 'Usuário';
    this.loadCustomerData();
  }

  loadCustomerData() {
    const userId = this.tokenService.getUserId();
    
    if (!userId) {
      console.error('User ID not found');
      this.errorMessage = 'Erro: ID do usuário não encontrado';
      return;
    }

    this.isLoadingBalance = true;
    this.errorMessage = '';

    this.customerService.getCustomerById(userId).subscribe({
      next: (response) => {
        console.log('Customer data loaded:', response);
        this.totalBalance = response.totalBalance || 0;
        this.isLoadingBalance = false;
      },
      error: (error) => {
        console.error('Error loading customer data:', error);
        this.errorMessage = this.errorHandler.handleHttpError(error);
        this.totalBalance = 0;
        this.isLoadingBalance = false;
      }
    });
  }

  createAccount() {
    this.router.navigate(['/accounts']);
  }

  withdraw() {
    this.router.navigate(['/withdraw']);  
  }

  deposit() {
    this.router.navigate(['/deposit']);
  }

  transfer() {
    this.router.navigate(['/transfer']);
  }

  viewStatement() {
    this.router.navigate(['/statement']);
  }

  logout() {
    this.authService.logout();
  }

  refreshBalance() {
    this.loadCustomerData();
  }
}