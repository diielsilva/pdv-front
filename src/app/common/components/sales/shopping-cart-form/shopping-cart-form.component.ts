import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { CartItemRequest } from '../../../dtos/cart/cart-item.request';
import { LoadingHelper } from '../../../helpers/loading.helper';

@Component({
  selector: 'app-shopping-cart-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputNumberModule, ButtonModule, PanelModule],
  templateUrl: './shopping-cart-form.component.html',
  styleUrl: './shopping-cart-form.component.css'
})
export class ShoppingCartFormComponent implements OnInit {
  protected form!: FormGroup;
  @Output() public notifyParentToInsertIntoCart: EventEmitter<CartItemRequest> = new EventEmitter<CartItemRequest>();

  public constructor(protected loadingHelper: LoadingHelper) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      productId: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
      amount: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
    });
  }

  protected insert(): void {
    const dto: CartItemRequest = { productId: this.form.controls['productId'].value, amount: this.form.controls['amount'].value };
    this.notifyParentToInsertIntoCart.emit(dto);
    this.form.reset();
  }

}
