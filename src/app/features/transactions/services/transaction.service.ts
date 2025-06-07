import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TransactionData } from '../../../shared/models/transactionData.model';
import { TransactionResponse } from '../../../shared/models/transactionResponse.model';
import { StatementResponse } from '../../../shared/models/statement.model';
import { TransferRequest } from '../../../shared/models/transferRequest.model';
import { TransferResponse } from '../../../shared/models/transferResponse.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  private getHeaders(customerId: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Customer-Id': customerId || ''
    });
  }

  deposit(transactionData: TransactionData, customerId: string): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.apiUrl}/deposit`, 
      {
        accountNumberOrigin: transactionData.accountNumberOrigin,
        amount: transactionData.amount
      },
      { headers: this.getHeaders(customerId) }
    );
  }

  withdraw(transactionData: TransactionData, customerId: string): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.apiUrl}/withdraw`, 
      {
        accountNumberOrigin: transactionData.accountNumberOrigin,
        amount: transactionData.amount
      },
      { headers: this.getHeaders(customerId) }
    );
  }

  transfer(transferData: TransferRequest, customerId: string): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.apiUrl}/transfer`, 
      transferData, 
      { headers: this.getHeaders(customerId) }
    );
  }

  getStatementByAccount(accountNumber: string, customerId: string): Observable<StatementResponse[]> {
    return this.http.get<StatementResponse[]>(`${this.apiUrl}/statement/${accountNumber}`, 
      { headers: this.getHeaders(customerId) }
    );
  }
}