import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { User } from '../../../../core/models/user';
import { UserPerformanceRequest } from '../../../dtos/users/user-performance.request';
import { LoadingHelper } from '../../../helpers/loading.helper';

@Component({
  selector: 'app-user-performance-report-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule, CalendarModule],
  templateUrl: './user-performance-report-modal.component.html',
  styleUrl: './user-performance-report-modal.component.css'
})
export class UserPerformanceReportModalComponent implements OnInit {
  protected form!: FormGroup;
  @Input({ required: true }) public isVisible!: boolean;
  @Input({ required: true }) public user!: User;
  @Output() public notifyParentToCloseModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() public notifyParentToDisplayReport: EventEmitter<UserPerformanceRequest> = new EventEmitter<UserPerformanceRequest>();

  public constructor(protected loadingHelper: LoadingHelper) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      start: new FormControl<Date | null>(null, [Validators.required]),
    });
  }

  protected performanceReport(): void {
    const dto: UserPerformanceRequest = { userId: this.user.id, start: this.form.controls['start'].value };
    this.notifyParentToDisplayReport.emit(dto);
    this.close();
  }

  protected close(): void {
    this.form.reset();
    this.notifyParentToCloseModal.emit();
  }

}
