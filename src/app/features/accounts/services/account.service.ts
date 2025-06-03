import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Account } from '../../../shared/models/account.model';
import { AccountRequest } from '../../../shared/models/accountRequest.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  createAccount(accountData: AccountRequest): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/accounts`, accountData);
  }

  getAccounts(customerId: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts/${customerId}`);
  }

}