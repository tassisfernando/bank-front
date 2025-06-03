import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Customer } from '../../../shared/models/customer.model';

export interface CustomerRegistrationResponse {
  message: string;
  customerId?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  registerCustomer(customer: Customer): Observable<CustomerRegistrationResponse> {
    return this.http.post<CustomerRegistrationResponse>(`${this.apiUrl}`, customer);
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  updateCustomer(id: string, customer: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }
}