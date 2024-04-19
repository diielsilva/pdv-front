import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoadingHelper } from '../../../helpers/loading.helper';

@Component({
  selector: 'app-search-products-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './search-products-form.component.html',
  styleUrl: './search-products-form.component.css'
})
export class SearchProductsFormComponent implements OnInit {
  protected form!: FormGroup;
  @Output() public notifyParentToSearch: EventEmitter<string> = new EventEmitter<string>();

  public constructor(protected loadingHelper: LoadingHelper) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      description: new FormControl<string | null>('', { validators: [Validators.required] })
    });
  }

  protected search(): void {
    const searchedTerm = this.form.controls['description'].value;
    this.notifyParentToSearch.emit(searchedTerm);
  }

}
