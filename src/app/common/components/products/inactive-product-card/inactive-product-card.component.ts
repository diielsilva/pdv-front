import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Product } from '../../../../core/models/product';
import { LoadingHelper } from '../../../helpers/loading.helper';
import { ProductCardContentComponent } from '../product-card-content/product-card-content.component';

@Component({
  selector: 'app-inactive-product-card',
  standalone: true,
  imports: [ProductCardContentComponent, PanelModule, ButtonModule],
  templateUrl: './inactive-product-card.component.html',
  styleUrl: './inactive-product-card.component.css'
})
export class InactiveProductCardComponent {
  @Input({ required: true }) public product!: Product;
  @Output() public notifyParentToReactivateProduct: EventEmitter<number> = new EventEmitter<number>();

  public constructor(protected loadingHelper: LoadingHelper) { }
}
