import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';
import { SaleComponent } from '../../../../common/components/sale/sale.component';
import { LoadingHelper } from '../../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../../common/helpers/message.helper';
import { Sale } from '../../../../core/models/sale';
import { ReportService } from '../../../../core/services/report.service';
import { SaleService } from '../../../../core/services/sale.service';

@Component({
  selector: 'app-search-sale',
  standalone: true,
  imports: [ReactiveFormsModule, PanelModule, ButtonModule, CalendarModule, SaleComponent],
  templateUrl: './search-sale.component.html',
  styleUrl: './search-sale.component.css'
})
export class SearchSaleComponent implements OnInit {
  protected reportService = inject(ReportService)
  protected searchForm!: FormGroup
  protected searchedDate!: Date
  protected loadingHelper = inject(LoadingHelper)
  protected messageHelper = inject(MessageHelper)
  protected saleService = inject(SaleService)
  protected sales: Sale[] = []

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      date: new FormControl<Date | null>(null, [Validators.required])
    })
  }

  handleSearchSaleButton(): void {
    if (this.searchForm.valid) {
      this.searchedDate = this.searchForm.controls['date'].value
      this.saleService.findActiveByDate(this.searchedDate).subscribe({
        next: (sales: Sale[]) => {
          if (sales.length === 0) {
            this.messageHelper.displayMessage('Não foram encontradas vendas com a data selecionada', 'error')
          } else {
            this.sales = sales
          }
        },
        error: (response: HttpErrorResponse) => {
          this.messageHelper.displayMessage(response.error.message, 'error')
        }
      })
    }
  }

  profitReport(): void {
    this.reportService.generateReportByDate(this.searchedDate).subscribe({
      next: (response: Blob) => {
        const reportWindow = window.URL.createObjectURL(response)
        window.open(reportWindow)
      },
      error: (response: HttpErrorResponse) => {
        this.messageHelper.displayMessage(response.error.message, 'error')
      }
    })
  }

  shouldDisableSearchSaleButton(): boolean {
    return this.loadingHelper.isUnderLoading() || this.searchForm.invalid
  }

  shouldDisableProfitReportButton(): boolean {
    return this.loadingHelper.isUnderLoading()
  }
}
