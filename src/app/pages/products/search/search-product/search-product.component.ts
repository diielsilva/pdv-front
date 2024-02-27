import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { PaginatorComponent } from '../../../../common/components/paginator/paginator.component';
import { ProductComponent } from '../../../../common/components/product/product.component';
import { LoadingHelper } from '../../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../../common/helpers/message.helper';
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
export class SearchProductComponent implements OnInit {
  protected productService = inject(ProductService)
  protected loader = inject(LoadingHelper)
  protected messager = inject(MessageHelper)
  protected products: Product[] = []
  protected actualPage = 1
  protected totalPages = 1
  protected searchedTerms = ''
  protected searchForm!: FormGroup

  public ngOnInit(): void {
    this.searchForm = new FormGroup({
      description: new FormControl<string | null>(null, { validators: Validators.required })
    })
  }

  protected canDisplayPaginator(): boolean {
    return this.products.length > 0
  }

  protected shouldDisableSearchButton(): boolean {
    return this.loader.isUnderLoading() || this.searchForm.invalid
  }

  protected searchProducts(): void {
    this.searchedTerms = this.searchForm.controls['description'].value
    this.productService.findActiveByDescriptionContaining(this.searchedTerms, this.actualPage).subscribe({
      next: (response: Pageable<Product>) => {
        this.totalPages = response.totalPages
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
  }

  protected handleChildOperation(isSuccessful: boolean): void {
    if (isSuccessful) {
      this.searchProducts()
    } else {
      this.resetPaginator()
    }
  }

  protected handlePageEvent(page: number): void {
    this.actualPage = page
    this.searchProducts()
  }

  protected resetPaginator(): void {
    this.actualPage = 1
    this.totalPages = 1
    this.products = []
  }

}
