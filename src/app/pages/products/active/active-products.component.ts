import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
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
export class ActiveProductsComponent implements OnInit {
  protected productService = inject(ProductService)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected products: Product[] = []
  protected actualPage = 1
  protected totalPages = 1


  public ngOnInit(): void {
    this.findActiveProducts()
  }

  protected findActiveProducts(): void {
    this.productService.findActive(this.actualPage).subscribe({
      next: (response: Pageable<Product>) => {
        this.totalPages = response.totalPages
        this.products = response.content
      },
      error: (response: HttpErrorResponse) => this.messager.displayMessage(response.error.message, 'error')
    })
  }

  protected handleChildrenOperations(isSuccessful: boolean): void {
    if (isSuccessful) {
      this.findActiveProducts()
    } else {
      this.resetPaginator()
    }
  }

  protected handlePageChange(page: number): void {
    this.actualPage = page
    this.findActiveProducts()
  }

  protected resetPaginator(): void {
    this.actualPage = 1
    this.totalPages = 1
    this.products = []
  }

}
