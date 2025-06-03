import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-button.html',
  styleUrls: ['./back-button.scss']
})
export class BackButton {
  @Input() text: string = 'Voltar';
  @Input() route: string = '/dashboard';

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate([this.route]);
  }
}