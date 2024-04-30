import { Component, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { take } from 'rxjs';
import { PaginatorComponent } from '../../../common/components/paginator/paginator.component';
import { ActiveUserCardComponent } from '../../../common/components/users/active-user-card/active-user-card.component';
import { UserPerformanceReportModalComponent } from '../../../common/components/users/user-performance-report-modal/user-performance-report-modal.component';
import { UserPerformanceRequest } from '../../../common/dtos/users/user-performance.request';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { User } from '../../../core/models/user';
import { ReportService } from '../../../core/services/report.service';
import { UserService } from '../../../core/services/user.service';
import { Pageable } from '../../../core/utils/pageable';

@Component({
  selector: 'app-active-users',
  standalone: true,
  imports: [PanelModule, ActiveUserCardComponent, UserPerformanceReportModalComponent, PaginatorComponent],
  templateUrl: './active-users.page.html',
  styleUrl: './active-users.page.css'
})
export class ActiveUsersPage implements OnInit {
  protected users: User[] = [];
  protected modalsPerUser: boolean[] = [];
  protected selectedUser: number = -1;
  protected currentPage: number = 1;
  protected totalOfPages: number = 1;

  public constructor(
    protected userService: UserService,
    protected reportService: ReportService,
    protected loadingHelper: LoadingHelper
  ) { }

  public ngOnInit(): void {
    this.findActive();
  }

  protected openModal(selectedUser: number): void {
    this.selectedUser = selectedUser;
    this.modalsPerUser[selectedUser] = true;
  }

  protected closeModal(): void {
    this.modalsPerUser[this.selectedUser] = false;
  }

  protected changePage(page: number): void {
    this.currentPage = page;
    this.findActive();
  }

  protected findActive(): void {
    this.userService.findActive(this.currentPage).pipe(take(1)).subscribe({
      next: (response: Pageable<User>) => {
        this.users = [];
        this.modalsPerUser = [];
        this.users = response.content;
        this.totalOfPages = response.totalPages;
        this.users.forEach(() => this.modalsPerUser.push(false));
      }
    });
  }

  protected performanceReport(dto: UserPerformanceRequest): void {
    this.reportService.performanceReport(dto).pipe(take(1)).subscribe({
      next: (response: Blob) => {
        const reportWindow: string = window.URL.createObjectURL(response);
        window.open(reportWindow);
      }
    });
  }
}
