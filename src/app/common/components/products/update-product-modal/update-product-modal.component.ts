import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Product } from '../../../../core/models/product';
import { ProductRequest } from '../../../dtos/products/product.request';
import { LoadingHelper } from '../../../helpers/loading.helper';

@Component({
  selector: 'app-update-product-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonModule],
  templateUrl: './update-product-modal.component.html',
  styleUrl: './update-product-modal.component.css'
})
export class UpdateProductModalComponent implements OnInit {
  protected form!: FormGroup;
  @Input({ required: true }) public product!: Product;
  @Input({ required: true }) public isModalVisible!: boolean;
  @Output() public notifyParentToUpdate: EventEmitter<ProductRequest> = new EventEmitter<ProductRequest>();
  @Output() public notifyParentToCloseModal: EventEmitter<void> = new EventEmitter<void>();

  public constructor(protected loadingHelper: LoadingHelper) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      description: new FormControl<string | null>(this.product.description, { validators: [Validators.required] }),
      amount: new FormControl<number | null>(this.product.amount, { validators: [Validators.required, Validators.min(0)] }),
      price: new FormControl<number | null>(this.product.price, { validators: [Validators.required, Validators.min(0)] })
    });
  }

  protected update(): void {
    const dto: ProductRequest = {
      description: this.form.controls['description'].value,
      amount: this.form.controls['amount'].value,
      price: this.form.controls['price'].value
    };

    this.notifyParentToUpdate.emit(dto);

  }

  protected close(): void {
    this.form.controls['description'].setValue(this.product.description);
    this.form.controls['amount'].setValue(this.product.amount);
    this.form.controls['price'].setValue(this.product.price);
    this.notifyParentToCloseModal.emit();
  }

}
