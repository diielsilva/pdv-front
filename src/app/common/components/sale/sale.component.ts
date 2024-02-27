import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { Sale } from '../../../core/models/sale';
import { ReportService } from '../../../core/services/report.service';
import { SaleService } from '../../../core/services/sale.service';
import { SaleDetailsResponse } from '../../dtos/sales/sale-details.response';
import { LoadingHelper } from '../../helpers/loading.helper';
import { MessageHelper } from '../../helpers/message.helper';
import { PaymentMethodPipe } from '../../pipes/payment-method.pipe';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, PaymentMethodPipe, PanelModule, ButtonModule, DialogModule, DividerModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {
  protected saleService = inject(SaleService)
  protected reportService = inject(ReportService)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected isDetailsModalVisible = false
  protected saleDetails?: SaleDetailsResponse
  @Input({ required: true }) public sale!: Sale
  @Output() public onHttpRequestEvent = new EventEmitter<boolean>()

  protected isSaleInactive(): boolean {
    return this.sale.deletedAt !== null
  }

  protected shouldDisableButtons(): boolean {
    return this.loader.isUnderLoading()
  }

  protected getSaleDetails(): void {
    this.saleService.details(this.sale.id).subscribe({
      next: (response: SaleDetailsResponse) => {
        this.saleDetails = response
        this.isDetailsModalVisible = true
      },
      error: (response: HttpErrorResponse) => this.messager.displayMessage(response.error.message, 'error')
    })
  }

  protected generateSaleReport(): void {
    this.reportService.generateSaleReport(this.sale).subscribe({
      next: (response: Blob) => {
        const reportWindow = window.URL.createObjectURL(response)
        window.open(reportWindow)
      },
      error: (response: HttpErrorResponse) => this.messager.displayMessage(response.error.message, 'error')
    })
  }

  protected deleteSale(): void {
    this.saleService.delete(this.sale.id).subscribe({
      next: () => {
        this.messager.displayMessage('Venda removida com sucesso!', 'success')
        this.onHttpRequestEvent.emit(true)
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
        this.onHttpRequestEvent.emit(false)
      }
    })
  }

}
