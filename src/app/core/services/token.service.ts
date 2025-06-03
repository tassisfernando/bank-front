import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_NAME_KEY = 'user_name';
  private readonly USER_ID_KEY = 'user_id';

  saveToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  saveUserName(name: string): void {
    sessionStorage.setItem(this.USER_NAME_KEY, name);
  }

  getUserName(): string | null {
    return sessionStorage.getItem(this.USER_NAME_KEY);
  }


  saveUserId(name: string): void {
    sessionStorage.setItem(this.USER_ID_KEY, name);
  }

  getUserId(): string | null {
    return sessionStorage.getItem(this.USER_ID_KEY);
  }

  removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_NAME_KEY);
    sessionStorage.removeItem(this.USER_ID_KEY)
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}