import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFormComponent } from '../transaction-form/transaction-form';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, TransactionFormComponent],
  templateUrl: './deposit.html',
  styleUrls: ['./deposit.scss']
})
export class DepositComponent {
}