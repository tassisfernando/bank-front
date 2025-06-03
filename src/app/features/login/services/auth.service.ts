import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';
import { AuthResponse } from '../../../shared/models/authResponse.model';
import { Auth } from '../../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth/login`; 

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}
  
  login(auth: Auth): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, auth);
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }
}