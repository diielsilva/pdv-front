import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ProductRequest } from '../../../common/dtos/products/product.request';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { SubscriptionHelper } from '../../../common/helpers/subscription.helper';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-insert-product',
  standalone: true,
  imports: [ReactiveFormsModule, PanelModule, InputTextModule, InputNumberModule, ButtonModule],
  templateUrl: './insert-product.component.html',
  styleUrl: './insert-product.component.css'
})
export class InsertProductComponent implements OnInit, OnDestroy {
  protected productService = inject(ProductService)
  protected subscriber = inject(SubscriptionHelper)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected insertForm!: FormGroup

  public ngOnInit(): void {
    this.insertForm = new FormGroup({
      description: new FormControl<string | null>(null, { validators: [Validators.required] }),
      amount: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
      price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] })
    })
  }

  public ngOnDestroy(): void {
    this.subscriber.clean()
  }

  public insertProduct(): void {
    const dto: ProductRequest = {
      description: this.insertForm.controls['description'].value,
      amount: this.insertForm.controls['amount'].value,
      price: this.insertForm.controls['price'].value
    }

    const subscription = this.productService.save(dto)
      .subscribe({
        next: () => {
          this.messager.displayMessage('Produto cadastrado com sucesso!', 'success')
          this.insertForm.reset()
        },
        error: (response: HttpErrorResponse) => this.messager.displayMessage(response.error.message, 'error')
      })

    this.subscriber.add(subscription)
  }

}
