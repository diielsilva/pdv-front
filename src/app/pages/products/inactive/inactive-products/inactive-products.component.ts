import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { PaginatorComponent } from '../../../../common/components/paginator/paginator.component';
import { ProductComponent } from '../../../../common/components/product/product.component';
import { LoadingHelper } from '../../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../../common/helpers/message.helper';
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
export class InactiveProductsComponent implements OnInit {
  protected productService = inject(ProductService)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected products: Product[] = []
  protected actualPage = 1
  protected totalPages = 1

  public ngOnInit(): void {
    this.findInactiveProducts()
  }

  protected findInactiveProducts(): void {
    this.productService.findInactive(this.actualPage).subscribe({
      next: (response: Pageable<Product>) => {
        this.totalPages = response.totalPages
        this.products = response.content
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.response, 'error')
        this.resetPaginator()
      }
    })
  }

  protected handleChildrenOperations(isSuccessful: boolean): void {
    if (isSuccessful) {
      this.findInactiveProducts()
    } else {
      this.resetPaginator()
    }
  }

  protected resetPaginator(): void {
    this.actualPage = 1
    this.totalPages = 1
    this.products = []
  }
}
