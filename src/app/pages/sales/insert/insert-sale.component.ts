import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { SubscriptionHelper } from '../../../common/helpers/subscription.helper';
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
export class InsertSaleComponent implements OnInit, OnDestroy {
  protected saleService = inject(SaleService)
  protected productService = inject(ProductService)
  protected subscriber = inject(SubscriptionHelper)
  protected messager = inject(MessageHelper)
  protected loader = inject(LoadingHelper)
  protected cartForm!: FormGroup
  protected saleForm!: FormGroup
  protected paymentMethods = ['Cartão', 'Pix', 'Dinheiro']
  protected purchaseCart: CartItemResponse[] = []

  public ngOnInit(): void {
    this.cartForm = new FormGroup({
      productId: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
      amount: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] })
    })

    this.saleForm = new FormGroup({
      discount: new FormControl<number | null>(null, { validators: [Validators.min(0), Validators.max(100)] }),
      paymentMethod: new FormControl<string | null>(null, { validators: [Validators.required] })
    })

  }

  public ngOnDestroy(): void {
    this.subscriber.clean()
  }

  protected insertIntoCart(): void {
    const productId: number = this.cartForm.controls['productId'].value

    if (this.hasDuplicatedProducts()) {
      this.messager.displayMessage('O produto selecionado já está no carrinho!', 'error')
    } else {
      const subscription = this.productService.findActiveById(productId).subscribe({
        next: (product: Product) => {

          const item: CartItemResponse = {
            productId: product.id,
            description: product.description,
            amount: this.cartForm.controls['amount'].value,
            price: product.price
          }

          if (item.amount > product.amount) {
            this.messager.displayMessage('Não há estoque suficiente do produto selecionado!', 'error')
          } else {
            this.purchaseCart.push(item)
            this.cartForm.reset()
          }

        },
        error: (response: HttpErrorResponse) => {
          this.messager.displayMessage(response.error.message, 'error')
        }
      })

      this.subscriber.add(subscription)
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

    const subscription = this.saleService.save(dto).subscribe({
      next: () => {
        this.messager.displayMessage('Venda cadastrada com sucesso!', 'success')
        this.cartForm.reset()
        this.purchaseCart = []
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
      }
    })

    this.subscriber.add(subscription)
  }

  protected hasDuplicatedProducts(): boolean {
    for (let i = 0; i < this.purchaseCart.length; i++) {
      if (this.purchaseCart[i].productId === this.cartForm.controls['productId'].value) {
        return true
      }

    }

    return false
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
  }
}
