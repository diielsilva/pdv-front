import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { take } from 'rxjs';
import { ShoppingCartFormComponent } from '../../../common/components/sales/shopping-cart-form/shopping-cart-form.component';
import { ShoppingCartItemsComponent } from '../../../common/components/sales/shopping-cart-items/shopping-cart-items.component';
import { CartItemRequest } from '../../../common/dtos/cart/cart-item.request';
import { CartItemResponse } from '../../../common/dtos/cart/cart-item.response';
import { SaleItemRequest } from '../../../common/dtos/sales/sale-item.request';
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
  imports: [ReactiveFormsModule, InputNumberModule, InputTextModule, ButtonModule, PanelModule, DropdownModule, CurrencyPipe, TableModule, ShoppingCartFormComponent,
    ShoppingCartItemsComponent],
  templateUrl: './insert-sale.page.html',
  styleUrl: './insert-sale.page.css'
})
export class InsertSalePage implements OnInit {
  protected saleForm!: FormGroup;
  protected paymentMethods = ['Cartão', 'Pix', 'Dinheiro'];
  protected shoppingCart: CartItemResponse[] = [];
  protected totalCart: number = 0;
  protected cartTotalWithoutDiscount = 0;

  public constructor(
    protected saleService: SaleService,
    protected productService: ProductService,
    protected reportService: ReportService,
    protected messageHelper: MessageHelper,
    protected loadingHelper: LoadingHelper
  ) { }

  public ngOnInit(): void {
    this.saleForm = new FormGroup({
      discount: new FormControl<number | null>(null, { validators: [Validators.min(0), Validators.max(100)] }),
      paymentMethod: new FormControl<string | null>(null, { validators: [Validators.required] })
    })

  }

  protected insertIntoShoppingCart(dto: CartItemRequest): void {
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

  protected convertToValidPaymentMethod(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'Cartão':
        return 'CARD'
      case 'Pix':
        return 'PIX'
      case 'Dinheiro':
        return 'CASH'
      default:
        return ''
    }
  }

  protected finishSale(): void {
    const dto: SaleRequest = {
      discount: this.saleForm.controls['discount'].value === null ? 0 : this.saleForm.controls['discount'].value,
      paymentMethod: this.convertToValidPaymentMethod(this.saleForm.controls['paymentMethod'].value),
      items: []
    }

    for (let i = 0; i < this.shoppingCart.length; i++) {
      const item: SaleItemRequest = { productId: this.shoppingCart[i].productId, amount: this.shoppingCart[i].amount }
      dto.items.push(item)
    }

    this.saleService.save(dto).subscribe({
      next: (sale: Sale) => {
        this.messageHelper.display('Venda cadastrada com sucesso!', 'success')
        this.saleForm.reset()
        this.shoppingCart = []
        this.generateSaleReport(sale)
      }
    });

  }

  protected generateSaleReport(sale: Sale): void {
    this.reportService.saleReport(sale.id).pipe(take(1)).subscribe({
      next: (response: Blob) => {
        const reportWindow: string = window.URL.createObjectURL(response);
        window.open(reportWindow);
      },
    });
  }

}
