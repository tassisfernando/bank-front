import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../../../core/services/token.service';
import { AuthService } from '../../../login/services/auth.service';
import { HeaderComponent } from '../../../../shared/components/header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
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
    this.router.navigate(['/accounts']);
  }

  withdraw() {
    this.router.navigate(['/withdraw']);  
  }

  deposit() {
    this.router.navigate(['/deposit']);
  }

  viewStatement() {
    this.router.navigate(['/statement']);
  }

  logout() {
    this.authService.logout();
  }
}