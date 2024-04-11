import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Product } from '../../../../core/models/product';
import { ProductCardContentComponent } from '../product-card-content/product-card-content.component';

@Component({
  selector: 'app-active-product-card',
  standalone: true,
  imports: [PanelModule, ButtonModule, ProductCardContentComponent],
  templateUrl: './active-product-card.component.html',
  styleUrl: './active-product-card.component.css'
})
export class ActiveProductCardComponent {
  @Input({ required: true }) public product!: Product;
  @Input({ required: true }) public shouldDisplayActionButtons!: boolean;
  @Output() public notifyParentToDisplayUpdateModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() public notifyParentToDeleteProduct: EventEmitter<number> = new EventEmitter<number>();

}
