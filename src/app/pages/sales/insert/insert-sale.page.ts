import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { take } from 'rxjs';
import { ShoppingCartFormComponent } from '../../../common/components/sales/shopping-cart-form/shopping-cart-form.component';
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
  imports: [ReactiveFormsModule, InputNumberModule, InputTextModule, ButtonModule, PanelModule, DropdownModule, CurrencyPipe, TableModule, ShoppingCartFormComponent],
  templateUrl: './insert-sale.page.html',
  styleUrl: './insert-sale.page.css'
})
export class InsertSalePage implements OnInit {
  protected saleService = inject(SaleService)
  protected productService = inject(ProductService)
  protected reportService = inject(ReportService)
  protected messager = inject(MessageHelper)
  protected loader = inject(LoadingHelper)
  protected saleForm!: FormGroup
  protected paymentMethods = ['Cartão', 'Pix', 'Dinheiro']
  protected purchaseCart: CartItemResponse[] = []
  protected cartTotalWithoutDiscount = 0

  public ngOnInit(): void {
    this.saleForm = new FormGroup({
      discount: new FormControl<number | null>(null, { validators: [Validators.min(0), Validators.max(100)] }),
      paymentMethod: new FormControl<string | null>(null, { validators: [Validators.required] })
    })

  }

  protected insertIntoShoppingCart(dto: CartItemRequest): void {

    if (this.isProductInShoppingCart(dto.productId)) {
      this.messager.display('O produto selecionado já está no carrinho!', 'error')
    } else {
      this.productService.findActiveById(dto.productId).subscribe({
        next: (product: Product) => {

          const item: CartItemResponse = {
            productId: product.id,
            description: product.description,
            amount: dto.amount,
            price: product.price
          }

          if (item.amount > product.amount) {
            this.messager.display('Não há estoque suficiente do produto selecionado!', 'error')
          } else {
            this.purchaseCart.push(item);
            this.calculateSubTotal()
          }

        }
      });

    }
  }

  protected finishSale(): void {
    const dto: SaleRequest = {
      discount: this.saleForm.controls['discount'].value === null ? 0 : this.saleForm.controls['discount'].value,
      paymentMethod: this.convertToValidPaymentMethod(this.saleForm.controls['paymentMethod'].value),
      items: []
    }

    for (let i = 0; i < this.purchaseCart.length; i++) {
      const item: SaleItemRequest = { productId: this.purchaseCart[i].productId, amount: this.purchaseCart[i].amount }
      dto.items.push(item)
    }

    this.saleService.save(dto).subscribe({
      next: (sale: Sale) => {
        this.messager.display('Venda cadastrada com sucesso!', 'success')
        this.saleForm.reset()
        this.purchaseCart = []
        this.generateSaleReport(sale)
      }
    });

  }

  protected isProductInShoppingCart(id: number): boolean {
    for (let i = 0; i < this.purchaseCart.length; i++) {

      if (this.purchaseCart[i].productId === id) {
        return true;
      }

    }

    return false;
  }

  protected calculateSubTotal(): void {
    this.cartTotalWithoutDiscount = 0
    this.purchaseCart.forEach(item => {
      this.cartTotalWithoutDiscount += item.amount * item.price
    })
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

  protected removeFromCart(productId: number): void {
    const updatedSaleItems: CartItemResponse[] = []

    for (let i = 0; i < this.purchaseCart.length; i++) {
      if (this.purchaseCart[i].productId !== productId) {
        updatedSaleItems.push(this.purchaseCart[i])
      }
    }

    if (updatedSaleItems.length === 0) {
      this.saleForm.reset()
    }

    this.purchaseCart = updatedSaleItems;

    this.calculateSubTotal()
  }

  protected generateSaleReport(sale: Sale): void {
    this.reportService.saleReport(sale.id).pipe(take(1)).subscribe({
      next: (response: Blob) => {
        const reportWindow = window.URL.createObjectURL(response);
        window.open(reportWindow);
      },
    });

  }
}
