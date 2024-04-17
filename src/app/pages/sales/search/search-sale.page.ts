import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { take } from 'rxjs';
import { ActiveSaleCardComponent } from '../../../common/components/sales/active-sale-card/active-sale-card.component';
import { SaleDetailsModalComponent } from '../../../common/components/sales/sale-details-modal/sale-details-modal.component';
import { SearchSalesFormComponent } from '../../../common/components/sales/search-sales-form/search-sales-form.component';
import { SaleDetailsResponse } from '../../../common/dtos/sales/sale-details.response';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { Sale } from '../../../core/models/sale';
import { ReportService } from '../../../core/services/report.service';
import { SaleService } from '../../../core/services/sale.service';

@Component({
  selector: 'app-search-sale',
  standalone: true,
  imports: [PanelModule, ButtonModule, SearchSalesFormComponent, ActiveSaleCardComponent, SaleDetailsModalComponent],
  templateUrl: './search-sale.page.html',
  styleUrl: './search-sale.page.css'
})
export class SearchSalePage {
  protected sales: Sale[] = [];
  protected modalsPerSale: boolean[] = [];
  protected saleDetails?: SaleDetailsResponse;
  protected searchedDate!: Date;
  protected selectedSale: number = -1;

  public constructor(
    protected saleService: SaleService,
    protected reportService: ReportService,
    protected loadingHelper: LoadingHelper,
    protected messageHelper: MessageHelper
  ) { }

  protected displayModal(selectedSale: number): void {
    this.selectedSale = selectedSale;
    this.details();
  }

  protected closeModal(): void {
    this.modalsPerSale[this.selectedSale] = false;
  }

  protected search(date: Date): void {
    this.searchedDate = date;
    this.saleService.findActiveByDate(date).pipe(take(1)).subscribe({
      next: (response: Sale[]) => {
        this.modalsPerSale = [];
        this.sales = response;
        this.sales.forEach(() => this.modalsPerSale.push(false));

        if (this.sales.length === 0) {
          this.messageHelper.displayMessage('Não foram encontradas vendas com a data selecionada', 'error');
        }
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

  protected individualReport(id: number): void {
    this.reportService.generateSaleReport(id).pipe(take(1)).subscribe({
      next: (response: Blob) => {
        const reportWindow: string = window.URL.createObjectURL(response);
        window.open(reportWindow);
      }
    });
  }

  protected todaysReport(): void {
    this.reportService.generateReportByDate(this.searchedDate).subscribe({
      next: (response: Blob) => {
        const reportWindow = window.URL.createObjectURL(response)
        window.open(reportWindow)
      },
    });
  }

}
