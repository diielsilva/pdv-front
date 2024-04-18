import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { CartItemResponse } from '../../../dtos/cart/cart-item.response';

@Component({
  selector: 'app-shopping-cart-items',
  standalone: true,
  imports: [PanelModule, TableModule, ButtonModule, CurrencyPipe],
  templateUrl: './shopping-cart-items.component.html',
  styleUrl: './shopping-cart-items.component.css'
})
export class ShoppingCartItemsComponent {
  @Input({ required: true }) public items!: CartItemResponse[];
  @Input({ required: true }) public total!: number;
  @Output() public notifyParentToDeleteFromCart: EventEmitter<CartItemResponse> = new EventEmitter<CartItemResponse>();
}
