import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-product-card-content',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './product-card-content.component.html',
  styleUrl: './product-card-content.component.css'
})
export class ProductCardContentComponent {
  @Input({ required: true }) public product!: Product;
}
