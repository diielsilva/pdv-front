import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Sale } from '../../../../core/models/sale';
import { LoadingHelper } from '../../../helpers/loading.helper';
import { SaleCardContentComponent } from '../sale-card-content/sale-card-content.component';

@Component({
  selector: 'app-active-sale-card',
  standalone: true,
  imports: [SaleCardContentComponent, PanelModule, ButtonModule],
  templateUrl: './active-sale-card.component.html',
  styleUrl: './active-sale-card.component.css'
})
export class ActiveSaleCardComponent {
  @Input({ required: true }) public sale!: Sale;
  @Output() public notifyParentToDisplayDetails: EventEmitter<number> = new EventEmitter<number>();
  @Output() public notifyParentToDisplayReport: EventEmitter<number> = new EventEmitter<number>();

  public constructor(protected loadingHelper: LoadingHelper) { }
}
