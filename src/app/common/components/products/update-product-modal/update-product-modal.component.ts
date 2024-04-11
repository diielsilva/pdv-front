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
  protected updateForm!: FormGroup;
  @Input({ required: true }) public product!: Product;
  @Input({ required: true }) public isModalVisible!: boolean;
  @Output() public notifyParentToUpdateProduct: EventEmitter<ProductRequest> = new EventEmitter<ProductRequest>();
  @Output() public notifyParentToCloseUpdateModal: EventEmitter<void> = new EventEmitter<void>();

  public constructor(protected loadingHelper: LoadingHelper) { }

  public ngOnInit(): void {
    this.updateForm = new FormGroup({
      description: new FormControl<string | null>(this.product.description, { validators: [Validators.required] }),
      amount: new FormControl<number | null>(this.product.amount, { validators: [Validators.required, Validators.min(0)] }),
      price: new FormControl<number | null>(this.product.price, { validators: [Validators.required, Validators.min(0)] })
    });
  }

  protected updateProduct(): void {
    if (this.updateForm.valid) {
      const dto: ProductRequest = {
        description: this.updateForm.controls['description'].value,
        amount: this.updateForm.controls['amount'].value,
        price: this.updateForm.controls['price'].value
      };

      this.notifyParentToUpdateProduct.emit(dto);
    }
  }

  protected closeUpdateModal(): void {
    this.updateForm.controls['description'].setValue(this.product.description);
    this.updateForm.controls['amount'].setValue(this.product.amount);
    this.updateForm.controls['price'].setValue(this.product.price);
    this.notifyParentToCloseUpdateModal.emit();
  }

}
