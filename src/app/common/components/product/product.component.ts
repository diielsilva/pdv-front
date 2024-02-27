import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { Product } from '../../../core/models/product';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { LoadingHelper } from '../../helpers/loading.helper';
import { MessageHelper } from '../../helpers/message.helper';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ReactiveFormsModule, PanelModule, ButtonModule, CurrencyPipe, DatePipe, DialogModule, InputTextModule, InputNumberModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  protected productService = inject(ProductService)
  protected authService = inject(AuthService)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected isUpdateModalVisible = false
  protected updateForm!: FormGroup
  @Input({ required: true }) public product!: Product
  @Output() public isOperationSuccessful = new EventEmitter<boolean>()

  ngOnInit(): void {
    this.updateForm = new FormGroup({
      description: new FormControl<string | null>(null, { validators: [Validators.required] }),
      amount: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
      price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] })
    })
  }

  protected isProductInactive(): boolean {
    return this.product.deletedAt !== null
  }

  protected shouldDisplayButtons(): boolean {
    return this.authService.isUserAnAdmin() || this.authService.isUserAManager()
  }

  protected displayUpdateForm(): void {
    this.updateForm.controls['description'].setValue(this.product.description)
    this.updateForm.controls['amount'].setValue(this.product.amount)
    this.updateForm.controls['price'].setValue(this.product.price)
    this.isUpdateModalVisible = true
  }

  protected shouldDisableUpdateButton(): boolean {
    return this.loader.isUnderLoading() || this.updateForm.invalid
  }

  protected updateProduct(): void {
    const id = this.product.id
    const description = this.updateForm.controls['description'].value
    const amount = this.updateForm.controls['amount'].value
    const price = this.updateForm.controls['price'].value

    this.productService.update(id, description, amount, price).subscribe({
      next: () => {
        this.messager.displayMessage('Produto atualizado com sucesso!', 'success')
        this.isOperationSuccessful.emit(true)
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
        this.isOperationSuccessful.emit(false)
      }
    })
  }

  protected deleteProduct(): void {
    this.productService.delete(this.product.id).subscribe({
      next: () => {
        this.messager.displayMessage('O produto foi removido com sucesso!', 'success')
        this.isOperationSuccessful.emit(true)
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
        this.isOperationSuccessful.emit(false)
      }
    })
  }

  protected shouldDisableReactivateButton(): boolean {
    return this.loader.isUnderLoading()
  }

  protected reactivateProduct(): void {
    this.productService.reactivate(this.product.id).subscribe({
      next: () => {
        this.messager.displayMessage('O produto foi reativado com sucesso!', 'success')
        this.isOperationSuccessful.emit(true)
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
        this.isOperationSuccessful.emit(false)
      }
    })
  }
}
