import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { take } from 'rxjs';
import { ProductRequest } from '../../../common/dtos/products/product.request';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-insert-product',
  standalone: true,
  imports: [ReactiveFormsModule, PanelModule, InputTextModule, InputNumberModule, ButtonModule],
  templateUrl: './insert-product.page.html',
  styleUrl: './insert-product.page.css'
})
export class InsertProductPage implements OnInit {
  protected form!: FormGroup;

  public constructor(
    protected productService: ProductService,
    protected loadingHelper: LoadingHelper,
    protected messageHelper: MessageHelper
  ) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      description: new FormControl<string | null>(null, { validators: [Validators.required] }),
      amount: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
      price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] })
    });
  }

  public save(): void {
    const dto: ProductRequest = {
      description: this.form.controls['description'].value,
      amount: this.form.controls['amount'].value,
      price: this.form.controls['price'].value
    };

    this.productService.save(dto).pipe(take(1)).subscribe({
      next: () => {
        this.messageHelper.display('Produto cadastrado com sucesso!', 'success');
        this.form.reset();
      },
    });
  }

}
