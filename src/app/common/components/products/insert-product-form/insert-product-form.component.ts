import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ProductRequest } from '../../../dtos/products/product.request';
import { LoadingHelper } from '../../../helpers/loading.helper';

@Component({
  selector: 'app-insert-product-form',
  standalone: true,
  imports: [PanelModule, ButtonModule, InputTextModule, InputNumberModule, ReactiveFormsModule],
  templateUrl: './insert-product-form.component.html',
  styleUrl: './insert-product-form.component.css'
})
export class InsertProductFormComponent {
  protected form!: FormGroup;
  @Output() public notifyParentToInsert: EventEmitter<ProductRequest> = new EventEmitter<ProductRequest>();

  public constructor(protected loadingHelper: LoadingHelper) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      description: new FormControl<string | null>(null, { validators: [Validators.required] }),
      amount: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
      price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] })
    });
  }

  protected insert(): void {
    const dto: ProductRequest = {
      description: this.form.controls['description'].value,
      amount: this.form.controls['amount'].value,
      price: this.form.controls['price'].value
    };
    this.notifyParentToInsert.emit(dto);
    this.form.reset();
  }
}
