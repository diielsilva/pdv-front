import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { Product } from '../../../core/models/product';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { ProductRequest } from '../../dtos/products/product.request';
import { LoadingHelper } from '../../helpers/loading.helper';
import { MessageHelper } from '../../helpers/message.helper';
import { SubscriptionHelper } from '../../helpers/subscription.helper';
import { ProductCardContentComponent } from '../products/product-card-content/product-card-content.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ReactiveFormsModule, PanelModule, ButtonModule, CurrencyPipe, DatePipe, DialogModule, InputTextModule, InputNumberModule, ProductCardContentComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit, OnDestroy {
  protected productService = inject(ProductService)
  protected authService = inject(AuthService)
  protected subscriber = inject(SubscriptionHelper)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected isUpdateModalVisible = false
  protected updateForm!: FormGroup
  @Input({ required: true }) public product!: Product
  @Output() public shouldRefreshParentComponent = new EventEmitter<boolean>()

  public ngOnInit(): void {
    this.updateForm = new FormGroup({
      description: new FormControl<string | null>(null, { validators: [Validators.required] }),
      amount: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
      price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] })
    })
  }

  public ngOnDestroy(): void {
    this.subscriber.clean()
  }

  protected displayUpdateForm(): void {
    this.updateForm.controls['description'].setValue(this.product.description)
    this.updateForm.controls['amount'].setValue(this.product.amount)
    this.updateForm.controls['price'].setValue(this.product.price)
    this.isUpdateModalVisible = true
  }

  protected updateProduct(): void {
    const dto: ProductRequest = {
      description: this.updateForm.controls['description'].value,
      amount: this.updateForm.controls['amount'].value,
      price: this.updateForm.controls['price'].value
    }

    const subscription = this.productService.update(this.product.id, dto).subscribe({
      next: () => {
        this.messager.displayMessage('Produto atualizado com sucesso!', 'success')
        this.shouldRefreshParentComponent.emit(true)
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
        this.shouldRefreshParentComponent.emit(false)
      }
    })

    this.subscriber.add(subscription)
  }

  protected deleteProduct(): void {
    const subscription = this.productService.delete(this.product.id).subscribe({
      next: () => {
        this.messager.displayMessage('O produto foi removido com sucesso!', 'success')
        this.shouldRefreshParentComponent.emit(true)
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
        this.shouldRefreshParentComponent.emit(false)
      }
    })

    this.subscriber.add(subscription)
  }

  protected reactivateProduct(): void {
    const subscription = this.productService.reactivate(this.product.id).subscribe({
      next: () => {
        this.messager.displayMessage('O produto foi reativado com sucesso!', 'success')
        this.shouldRefreshParentComponent.emit(true)
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
        this.shouldRefreshParentComponent.emit(false)
      }
    })

    this.subscriber.add(subscription)
  }
}
