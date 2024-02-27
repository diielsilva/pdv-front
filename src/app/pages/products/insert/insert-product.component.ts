import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-insert-product',
  standalone: true,
  imports: [ReactiveFormsModule, PanelModule, InputTextModule, InputNumberModule, ButtonModule],
  templateUrl: './insert-product.component.html',
  styleUrl: './insert-product.component.css'
})
export class InsertProductComponent implements OnInit {
  protected productService = inject(ProductService)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected insertProductForm!: FormGroup

  public ngOnInit(): void {
    this.insertProductForm = new FormGroup({
      description: new FormControl<string | null>(null, { validators: [Validators.required] }),
      amount: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
      price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] })
    })
  }

  public insertProduct(): void {
    const description = this.insertProductForm.controls['description'].value
    const amount = this.insertProductForm.controls['amount'].value
    const price = this.insertProductForm.controls['price'].value

    this.productService.save(description, amount, price)
      .subscribe({
        next: () => {
          this.messager.displayMessage('Produto cadastrado com sucesso!', 'success')
          this.insertProductForm.reset()
        },
        error: (response: HttpErrorResponse) => this.messager.displayMessage(response.error.message, 'error')
      })
  }

  public shouldDisableInsertProductButton(): boolean {
    return this.loader.isUnderLoading() || this.insertProductForm.invalid
  }

}
