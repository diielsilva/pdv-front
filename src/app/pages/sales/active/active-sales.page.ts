import { Component, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { take } from 'rxjs';
import { PaginatorComponent } from '../../../common/components/paginator/paginator.component';
import { ActiveSaleCardComponent } from '../../../common/components/sales/active-sale-card/active-sale-card.component';
import { SaleDetailsModalComponent } from '../../../common/components/sales/sale-details-modal/sale-details-modal.component';
import { SaleDetailsResponse } from '../../../common/dtos/sales/sale-details.response';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { Sale } from '../../../core/models/sale';
import { ReportService } from '../../../core/services/report.service';
import { SaleService } from '../../../core/services/sale.service';
import { Pageable } from '../../../core/utils/pageable';

@Component({
  selector: 'app-active-sales',
  standalone: true,
  imports: [PanelModule, PaginatorComponent, ActiveSaleCardComponent, SaleDetailsModalComponent],
  templateUrl: './active-sales.page.html',
  styleUrl: './active-sales.page.css'
})
export class ActiveSalesPage implements OnInit {
  protected sales: Sale[] = [];
  protected modalsPerSale: boolean[] = [];
  protected saleDetails?: SaleDetailsResponse;
  protected currentPage: number = 1;
  protected totalOfPages: number = 1;
  protected selectedSale: number = -1;

  public constructor(
    protected saleService: SaleService,
    protected reportService: ReportService,
    protected loadingHelper: LoadingHelper,
    protected messageHelper: MessageHelper
  ) { }

  public ngOnInit(): void {
    this.findActive();
  }

  protected displayModal(selectedSale: number): void {
    this.selectedSale = selectedSale;
    this.details();
  }

  protected closeModal(): void {
    this.modalsPerSale[this.selectedSale] = false;
  }

  protected changePage(page: number): void {
    this.currentPage = page;
    this.findActive();
  }

  protected findActive(): void {
    this.saleService.findActive(this.currentPage).pipe(take(1)).subscribe({
      next: (response: Pageable<Sale>) => {
        this.modalsPerSale = [];
        this.totalOfPages = response.totalPages;
        this.sales = response.content;
        this.sales.forEach(() => this.modalsPerSale.push(false));
      }
    });
  }

  protected details(): void {
    this.saleService.details(this.sales[this.selectedSale].id).pipe(take(1)).subscribe({
      next: (response: SaleDetailsResponse) => {
        this.saleDetails = response;
        this.modalsPerSale[this.selectedSale] = true;
      }
    });
  }

  protected report(id: number): void {
    this.reportService.saleReport(id).pipe(take(1)).subscribe({
      next: (response: Blob) => {
        const reportWindow: string = window.URL.createObjectURL(response);
        window.open(reportWindow);
      }
    });
  }

}
