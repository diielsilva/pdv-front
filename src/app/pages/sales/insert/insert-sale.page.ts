import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { take } from 'rxjs';
import { ConfirmSaleFormComponent } from '../../../common/components/sales/confirm-sale-form/confirm-sale-form.component';
import { ShoppingCartFormComponent } from '../../../common/components/sales/shopping-cart-form/shopping-cart-form.component';
import { ShoppingCartItemsComponent } from '../../../common/components/sales/shopping-cart-items/shopping-cart-items.component';
import { CartItemRequest } from '../../../common/dtos/cart/cart-item.request';
import { CartItemResponse } from '../../../common/dtos/cart/cart-item.response';
import { ConfirmSaleRequest } from '../../../common/dtos/sales/confirm-sale.request';
import { SaleRequest } from '../../../common/dtos/sales/sale.request';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { Product } from '../../../core/models/product';
import { Sale } from '../../../core/models/sale';
import { ProductService } from '../../../core/services/product.service';
import { ReportService } from '../../../core/services/report.service';
import { SaleService } from '../../../core/services/sale.service';

@Component({
  selector: 'app-insert',
  standalone: true,
  imports: [PanelModule, ShoppingCartFormComponent, ShoppingCartItemsComponent, ConfirmSaleFormComponent],
  templateUrl: './insert-sale.page.html',
  styleUrl: './insert-sale.page.css'
})
export class InsertSalePage {
  protected shoppingCart: CartItemResponse[] = [];
  protected totalCart: number = 0;

  public constructor(
    protected saleService: SaleService,
    protected productService: ProductService,
    protected reportService: ReportService,
    protected messageHelper: MessageHelper,
    protected loadingHelper: LoadingHelper
  ) { }

  protected addToShoppingCart(dto: CartItemRequest): void {
    if (this.isProductInShoppingCart(dto.productId)) {
      this.messageHelper.display('O produto selecionado já está no carrinho!', 'error');
    } else {
      this.productService.findActiveById(dto.productId).pipe(take(1)).subscribe({
        next: (response: Product) => {

          const item: CartItemResponse = {
            productId: response.id, description: response.description, amount: dto.amount, price: response.price
          }

          if (item.amount > response.amount) {
            this.messageHelper.display('Não há estoque suficiente do produto selecionado!', 'error')
          } else {
            this.shoppingCart.push(item);
            this.calculateSubTotal();
          }
        }
      });
    }
  }

  protected deleteFromShoppingCart(dto: CartItemResponse): void {
    const shoppingCart: CartItemResponse[] = this.shoppingCart.filter((item: CartItemResponse) => item.productId !== dto.productId);
    this.shoppingCart = shoppingCart;
    this.calculateSubTotal();
  }

  protected isProductInShoppingCart(id: number): boolean {
    let isProductInShoppingCart: boolean = false;
    this.shoppingCart.forEach((item: CartItemResponse) => {
      if (item.productId === id) {
        isProductInShoppingCart = true;
      }
    });
    return isProductInShoppingCart;
  }

  protected calculateSubTotal(): void {
    this.totalCart = 0;
    this.shoppingCart.forEach(item => {
      this.totalCart += item.amount * item.price
    });
  }

  private transformPaymentMethod(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'Cartão':
        return 'CARD';
      case 'Pix':
        return 'PIX';
      case 'Dinheiro':
        return 'CASH';
      default:
        return '';
    }
  }

  protected save(dto: ConfirmSaleRequest): void {
    const sale: SaleRequest = {
      discount: dto.discount === null ? 0 : dto.discount,
      paymentMethod: this.transformPaymentMethod(dto.paymentMethod),
      items: []
    };

    this.shoppingCart.forEach((item: CartItemResponse) => {
      sale.items.push({ productId: item.productId, amount: item.amount });
    });

    this.saleService.save(sale).pipe(take(1)).subscribe({
      next: (response: Sale) => {
        this.messageHelper.display('Venda cadastrada com sucesso!', 'success');
        this.shoppingCart = [];
        this.report(response);
      }
    });

  }

  protected report(sale: Sale): void {
    this.reportService.saleReport(sale.id).pipe(take(1)).subscribe({
      next: (response: Blob) => {
        const reportWindow: string = window.URL.createObjectURL(response);
        window.open(reportWindow);
      },
    });
  }

}
