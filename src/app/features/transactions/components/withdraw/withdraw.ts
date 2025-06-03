import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFormComponent } from '../transaction-form/transaction-form';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, TransactionFormComponent],
  templateUrl: './withdraw.html',
  styleUrls: ['./withdraw.scss']
})
export class WithdrawComponent {
  
}