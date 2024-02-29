import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { PaginatorComponent } from '../../../../common/components/paginator/paginator.component';
import { ProductComponent } from '../../../../common/components/product/product.component';
import { LoadingHelper } from '../../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../../common/helpers/message.helper';
import { SubscriptionHelper } from '../../../../common/helpers/subscription.helper';
import { Product } from '../../../../core/models/product';
import { ProductService } from '../../../../core/services/product.service';
import { Pageable } from '../../../../core/utils/pageable';

@Component({
  selector: 'app-inactive-products',
  standalone: true,
  imports: [PaginatorComponent, ProductComponent, PanelModule, ButtonModule],
  templateUrl: './inactive-products.component.html',
  styleUrl: './inactive-products.component.css'
})
export class InactiveProductsComponent implements OnInit, OnDestroy {
  protected productService = inject(ProductService)
  protected subscriber = inject(SubscriptionHelper)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected products: Product[] = []
  protected currentPage = 1
  protected totalOfPages = 1

  public ngOnInit(): void {
    this.findInactiveProducts()
  }

  public ngOnDestroy(): void {
    this.subscriber.clean()
  }

  protected findInactiveProducts(): void {
    const subscription = this.productService.findInactive(this.currentPage).subscribe({
      next: (response: Pageable<Product>) => {
        this.totalOfPages = response.totalPages
        this.products = response.content
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.response, 'error')
        this.resetPaginator()
      }
    })

    this.subscriber.add(subscription)
  }

  protected shouldRefreshPage(shouldRefresh: boolean): void {
    if (shouldRefresh) {
      this.findInactiveProducts()
    } else {
      this.resetPaginator()
    }
  }

  protected resetPaginator(): void {
    this.currentPage = 1
    this.totalOfPages = 1
    this.products = []
  }
}
