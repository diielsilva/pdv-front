import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { CartItemResponse } from '../../../common/dtos/cart/cart-item.response';
import { SaleItemRequest } from '../../../common/dtos/sales/sale-item.request';
import { SaleRequest } from '../../../common/dtos/sales/sale.request';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product.service';
import { SaleService } from '../../../core/services/sale.service';

@Component({
  selector: 'app-insert',
  standalone: true,
  imports: [ReactiveFormsModule, InputNumberModule, InputTextModule, ButtonModule, PanelModule, DropdownModule, CurrencyPipe],
  templateUrl: './insert-sale.component.html',
  styleUrl: './insert-sale.component.css'
})
export class InsertSaleComponent implements OnInit {
  protected cartForm!: FormGroup
  protected saleForm!: FormGroup
  protected formBuilder = inject(FormBuilder)
  protected messageHelper = inject(MessageHelper)
  protected loadingHelper = inject(LoadingHelper)
  protected purchaseCart: CartItemResponse[] = []
  protected productService = inject(ProductService)
  protected saleService = inject(SaleService)
  protected paymentMethods = ['Cartão', 'Pix', 'Dinheiro']

  ngOnInit(): void {
    this.cartForm = this.formBuilder.group({
      productId: [null, [Validators.required, Validators.min(1)]],
      amount: [null, [Validators.required, Validators.min(1)]]
    })

    this.saleForm = this.formBuilder.group({
      discount: [null, Validators.max(100)],
      paymentMethod: [null, Validators.required]
    })

  }

  handleInsertIntoCartButton(): void {
    if (this.cartForm.valid) {

      const productId: number = this.cartForm.get('productId')?.value

      if (this.hasDuplicatedProducts()) {
        this.messageHelper.displayMessage('O produto selecionado já está no carrinho!', 'error')
      } else {
        this.productService.findActiveById(productId).subscribe({
          next: (product: Product) => {

            const cartItem: CartItemResponse = {
              productId: product.id,
              description: product.description,
              amount: this.cartForm.get('amount')?.value,
              price: product.price
            }

            if (cartItem.amount > product.amount) {
              this.messageHelper.displayMessage('Não há estoque suficiente do produto selecionado!', 'error')
            } else {
              this.purchaseCart.push(cartItem)
              this.cartForm.reset()
            }

          },
          error: (response: HttpErrorResponse) => {
            this.messageHelper.displayMessage(response.error.message, 'error')
          }
        })
      }

    }
  }

  shouldDisableInsertIntoCartButton(): boolean {
    return this.loadingHelper.isUnderLoading() || this.cartForm.invalid
  }

  handleFinishSaleButton(): void {
    if (this.saleForm.valid) {
      const saleRequest: SaleRequest = {
        discount: this.saleForm.get('discount')?.value === null ? 0 : this.saleForm.get('discount')?.value,
        paymentMethod: this.convertToValidPaymentMethod(this.saleForm.get('paymentMethod')?.value),
        items: []
      }

      for (let i = 0; i < this.purchaseCart.length; i++) {
        const item: SaleItemRequest = { productId: this.purchaseCart[i].productId, amount: this.purchaseCart[i].amount }
        saleRequest.items.push(item)
      }

      this.saleService.save(saleRequest).subscribe({
        next: () => {
          this.messageHelper.displayMessage('Venda cadastrada com sucesso!', 'success')
          this.cartForm.reset()
          this.purchaseCart = []
        },
        error: (response: HttpErrorResponse) => {
          this.messageHelper.displayMessage(response.error.message, 'error')
        }
      })
    }
  }

  shouldDisableFinishSaleButton(): boolean {
    return this.loadingHelper.isUnderLoading() || this.saleForm.invalid
  }

  hasDuplicatedProducts(): boolean {
    for (let i = 0; i < this.purchaseCart.length; i++) {

      if (this.purchaseCart[i].productId === this.cartForm.get('productId')?.value) {
        return true
      }

    }

    return false
  }

  convertToValidPaymentMethod(paymentMethod: string): string {
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

  handleRemoveFromCartButton(productId: number): void {
    const updatedSaleItems: CartItemResponse[] = []
    for (let i = 0; i < this.purchaseCart.length; i++) {
      if (this.purchaseCart[i].productId !== productId) {
        updatedSaleItems.push(this.purchaseCart[i])
      }
    }
    this.purchaseCart = updatedSaleItems;
  }
}
