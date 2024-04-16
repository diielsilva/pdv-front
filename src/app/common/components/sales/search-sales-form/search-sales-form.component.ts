import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { LoadingHelper } from '../../../helpers/loading.helper';

@Component({
  selector: 'app-search-sales-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, CalendarModule],
  templateUrl: './search-sales-form.component.html',
  styleUrl: './search-sales-form.component.css'
})
export class SearchSalesFormComponent implements OnInit {
  protected form!: FormGroup;
  @Output() public notifyParentToSearch: EventEmitter<Date> = new EventEmitter<Date>();

  public constructor(protected loadingHelper: LoadingHelper) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      date: new FormControl<Date | null>(null, [Validators.required])
    });
  }

  protected search(): void {
    this.notifyParentToSearch.emit(this.form.controls['date'].value);
  }
}
