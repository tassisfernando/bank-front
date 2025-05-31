import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth/login`; 

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}
  
  login(cpf: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { cpf, password });
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }
}