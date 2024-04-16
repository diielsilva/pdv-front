import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Sale } from '../../../../core/models/sale';
import { PaymentMethodPipe } from '../../../pipes/payment-method.pipe';

@Component({
  selector: 'app-sale-card-content',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, PaymentMethodPipe],
  templateUrl: './sale-card-content.component.html',
  styleUrl: './sale-card-content.component.css'
})
export class SaleCardContentComponent {
  @Input({ required: true }) public sale!: Sale;
}
