import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PaginatorComponent } from '../../../common/components/paginator/paginator.component';
import { SaleComponent } from '../../../common/components/sale/sale.component';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { SubscriptionHelper } from '../../../common/helpers/subscription.helper';
import { Sale } from '../../../core/models/sale';
import { SaleService } from '../../../core/services/sale.service';
import { Pageable } from '../../../core/utils/pageable';

@Component({
  selector: 'app-active-sales',
  standalone: true,
  imports: [PaginatorModule, PanelModule, SaleComponent, PaginatorComponent],
  templateUrl: './active-sales.component.html',
  styleUrl: './active-sales.component.css'
})
export class ActiveSalesComponent implements OnInit, OnDestroy {
  protected saleService = inject(SaleService)
  protected subscriber = inject(SubscriptionHelper)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected currentPage = 1
  protected totalOfPages = 1
  protected sales: Sale[] = []

  public ngOnInit(): void {
    this.findActiveSales()
  }

  public ngOnDestroy(): void {
    this.subscriber.clean()
  }

  protected findActiveSales(): void {
    const subscription = this.saleService.findActive(this.currentPage).subscribe({
      next: (response: Pageable<Sale>) => {
        this.totalOfPages = response.totalPages
        this.sales = response.content
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
      }
    })

    this.subscriber.add(subscription)
  }

  protected shouldRefreshPage(shouldRefresh: boolean): void {
    if (shouldRefresh) {
      this.findActiveSales()
    } else {
      this.resetPaginator()
    }
  }

  protected onPageChange(page: number): void {
    this.currentPage = page
    this.findActiveSales()
  }

  protected resetPaginator(): void {
    this.currentPage = 1
    this.totalOfPages = 1
    this.sales = []
  }

}
