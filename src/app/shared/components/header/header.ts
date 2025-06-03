import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  userName: string = '';

  constructor(private tokenService: TokenService) {}

  ngOnInit() {
    this.userName = this.tokenService.getUserName() || 'Usuário';
  }
}