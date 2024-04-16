import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { SaleDetailsResponse } from '../../../dtos/sales/sale-details.response';

@Component({
  selector: 'app-sale-details-modal',
  standalone: true,
  imports: [DialogModule, DividerModule, CurrencyPipe],
  templateUrl: './sale-details-modal.component.html',
  styleUrl: './sale-details-modal.component.css'
})
export class SaleDetailsModalComponent {
  @Input({ required: true }) public isVisible!: boolean;
  @Input({ required: true }) public sale?: SaleDetailsResponse;
  @Output() public notifyParentToCloseModal: EventEmitter<void> = new EventEmitter<void>();
}
