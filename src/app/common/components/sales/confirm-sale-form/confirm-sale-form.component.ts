import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { ConfirmSaleRequest } from '../../../dtos/sales/confirm-sale.request';
import { LoadingHelper } from '../../../helpers/loading.helper';

@Component({
  selector: 'app-confirm-sale-form',
  standalone: true,
  imports: [ReactiveFormsModule, PanelModule, InputNumberModule, DropdownModule, ButtonModule],
  templateUrl: './confirm-sale-form.component.html',
  styleUrl: './confirm-sale-form.component.css'
})
export class ConfirmSaleFormComponent implements OnInit {
  protected form!: FormGroup;
  protected paymentOptions: string[] = ['Cartão', 'Dinheiro', 'Pix'];
  @Output() public notifyParentToConfirm: EventEmitter<ConfirmSaleRequest> = new EventEmitter<ConfirmSaleRequest>();

  public constructor(protected loadingHelper: LoadingHelper) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      discount: new FormControl<number | null>(null, [Validators.min(0), Validators.max(100)]),
      paymentMethod: new FormControl<string | null>(null, [Validators.required])
    });
  }

  protected confirm(): void {
    const dto: ConfirmSaleRequest = { discount: this.form.controls['discount'].value, paymentMethod: this.form.controls['paymentMethod'].value };
    this.notifyParentToConfirm.emit(dto);
    this.form.reset();
  }

}
