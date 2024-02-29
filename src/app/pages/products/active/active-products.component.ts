import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PaginatorComponent } from '../../../common/components/paginator/paginator.component';
import { ProductComponent } from '../../../common/components/product/product.component';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { SubscriptionHelper } from '../../../common/helpers/subscription.helper';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product.service';
import { Pageable } from '../../../core/utils/pageable';

@Component({
  selector: 'app-active-products',
  standalone: true,
  imports: [PaginatorModule, ReactiveFormsModule, PanelModule, ButtonModule, ProductComponent, DialogModule, InputTextModule, InputNumberModule, PaginatorComponent],
  templateUrl: './active-products.component.html',
  styleUrl: './active-products.component.css'
})
export class ActiveProductsComponent implements OnInit, OnDestroy {
  protected productService = inject(ProductService)
  protected subscriber = inject(SubscriptionHelper)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected products: Product[] = []
  protected currentPage = 1
  protected totalOfPages = 1

  public ngOnInit(): void {
    this.findActiveProducts()
  }

  public ngOnDestroy(): void {
    this.subscriber.clean()
  }

  protected findActiveProducts(): void {
    const subscription = this.productService.findActive(this.currentPage).subscribe({
      next: (response: Pageable<Product>) => {
        this.totalOfPages = response.totalPages
        this.products = response.content
      },
      error: (response: HttpErrorResponse) => this.messager.displayMessage(response.error.message, 'error')
    })

    this.subscriber.add(subscription)
  }

  protected shouldRefreshPage(shouldRefresh: boolean): void {
    if (shouldRefresh) {
      this.findActiveProducts()
    } else {
      this.resetPaginator()
    }
  }

  protected handlePageChange(page: number): void {
    this.currentPage = page
    this.findActiveProducts()
  }

  protected resetPaginator(): void {
    this.currentPage = 1
    this.totalOfPages = 1
    this.products = []
  }

}
