import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PaginatorComponent } from '../../../common/components/paginator/paginator.component';
import { SaleComponent } from '../../../common/components/sale/sale.component';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
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
export class ActiveSalesComponent implements OnInit {
  protected saleService = inject(SaleService)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected actualPage = 1
  protected totalPages = 1
  protected sales: Sale[] = []

  public ngOnInit(): void {
    this.findActiveSales()
  }

  protected findActiveSales(): void {
    this.saleService.findActive(this.actualPage).subscribe({
      next: (response: Pageable<Sale>) => {
        this.totalPages = response.totalPages
        this.sales = response.content
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
      }
    })
  }

  protected handleChangesInsideChildren(value: boolean): void {
    if (value) {
      this.findActiveSales()
    } else {
      this.resetPaginator()
    }
  }

  protected onPageChange(page: number): void {
    this.actualPage = page
    this.findActiveSales()
  }

  protected resetPaginator(): void {
    this.actualPage = 1
    this.totalPages = 1
    this.sales = []
  }

}
