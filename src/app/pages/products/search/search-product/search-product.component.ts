import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
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
  selector: 'app-search-product',
  standalone: true,
  imports: [ReactiveFormsModule, PanelModule, ButtonModule, InputTextModule, PaginatorComponent, ProductComponent],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.css'
})
export class SearchProductComponent implements OnInit, OnDestroy {
  protected productService = inject(ProductService)
  protected subscriber = inject(SubscriptionHelper)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected products: Product[] = []
  protected currentPage = 1
  protected totalOfPages = 1
  protected searchedTerms = ''
  protected searchForm!: FormGroup

  public ngOnInit(): void {
    this.searchForm = new FormGroup({
      description: new FormControl<string | null>(null, { validators: Validators.required })
    })
  }

  public ngOnDestroy(): void {
    this.subscriber.clean()
  }

  protected searchProducts(): void {
    this.searchedTerms = this.searchForm.controls['description'].value

    const subscription = this.productService.findActiveByDescriptionContaining(this.searchedTerms, this.currentPage).subscribe({
      next: (response: Pageable<Product>) => {
        this.totalOfPages = response.totalPages
        this.products = response.content

        if (this.products.length === 0) {
          this.messager.displayMessage('Não foram encontrados produtos com a descrição indicada!', 'error')
        }
      },
      error: (response: HttpErrorResponse) => {
        this.messager.displayMessage(response.error.message, 'error')
        this.resetPaginator()
      }
    })

    this.subscriber.add(subscription)
  }

  protected shouldRefreshPage(shouldRefresh: boolean): void {
    if (shouldRefresh) {
      this.searchProducts()
    } else {
      this.resetPaginator()
    }
  }

  protected handlePageChange(page: number): void {
    this.currentPage = page
    this.searchProducts()
  }

  protected resetPaginator(): void {
    this.currentPage = 1
    this.totalOfPages = 1
    this.products = []
  }

}
