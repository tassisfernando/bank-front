import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../../../core/services/token.service';
import { AuthService } from '../../../login/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  userName: string = '';

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userName = this.tokenService.getUserName() || 'Usuário';
  }

  createAccount() {
    // Navegar para criação de conta bancária
    console.log('Criar conta bancária');
  }

  withdraw() {
    // Navegar para saque
    console.log('Sacar');
  }

  deposit() {
    // Navegar para depósito
    console.log('Depositar');
  }

  viewStatement() {
    // Navegar para extrato
    console.log('Ver extrato');
  }

  logout() {
    this.authService.logout();
  }
}