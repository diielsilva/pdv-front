import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';
import { SaleComponent } from '../../../../common/components/sale/sale.component';
import { LoadingHelper } from '../../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../../common/helpers/message.helper';
import { SubscriptionHelper } from '../../../../common/helpers/subscription.helper';
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
export class SearchSaleComponent implements OnInit, OnDestroy {
  protected saleService = inject(SaleService)
  protected reportService = inject(ReportService)
  protected subscriber = inject(SubscriptionHelper)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected searchForm!: FormGroup
  protected searchedDate!: Date
  protected sales: Sale[] = []

  public ngOnInit(): void {
    this.searchForm = new FormGroup({
      date: new FormControl<Date | null>(null, [Validators.required])
    })
  }

  public ngOnDestroy(): void {
    this.subscriber.clean()
  }

  protected searchSales(): void {
    this.searchedDate = this.searchForm.controls['date'].value

    const subscription = this.saleService.findActiveByDate(this.searchedDate).subscribe({
      next: (response: Sale[]) => {
        if (response.length === 0) {
          this.messager.displayMessage('Não foram encontradas vendas com a data selecionada', 'error')
        } else {
          this.sales = response
        }
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
      }
    })

    this.subscriber.add(subscription)
  }

  protected profitReport(): void {
    const subscription = this.reportService.generateReportByDate(this.searchedDate).subscribe({
      next: (response: Blob) => {
        const reportWindow = window.URL.createObjectURL(response)
        window.open(reportWindow)
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
      }
    })

    this.subscriber.add(subscription)
  }

}
