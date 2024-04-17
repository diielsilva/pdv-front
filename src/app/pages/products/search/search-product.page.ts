import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { take } from 'rxjs';
import { PaginatorComponent } from '../../../common/components/paginator/paginator.component';
import { ActiveProductCardComponent } from '../../../common/components/products/active-product-card/active-product-card.component';
import { SearchProductsFormComponent } from '../../../common/components/products/search-products-form/search-products-form.component';
import { UpdateProductModalComponent } from '../../../common/components/products/update-product-modal/update-product-modal.component';
import { ProductRequest } from '../../../common/dtos/products/product.request';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product.service';
import { SecurityService } from '../../../core/services/security.service';
import { Pageable } from '../../../core/utils/pageable';

//TODO ADD PAGINATION AND SUBSCRIPTION CLEAN
@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [PanelModule, PaginatorComponent, SearchProductsFormComponent, ActiveProductCardComponent, UpdateProductModalComponent],
  templateUrl: './search-product.page.html',
  styleUrl: './search-product.page.css'
})
export class SearchProductPage {
  protected products: Product[] = [];
  protected updateModalsPerProduct: boolean[] = [];
  protected currentPage: number = 1;
  protected totalOfPages: number = 1;
  protected searchedTerm: string = '';
  protected hasPreviousProducts: boolean = false;
  protected selectedProduct: number = -1;

  public constructor(
    protected productService: ProductService,
    protected securityService: SecurityService,
    protected loadingHelper: LoadingHelper,
    protected messageHelper: MessageHelper
  ) { }

  protected displayUpdateModal(selectedProduct: number): void {
    this.updateModalsPerProduct[selectedProduct] = true;
    this.selectedProduct = selectedProduct;
  }

  protected closeUpdateModal(): void {
    this.updateModalsPerProduct[this.selectedProduct] = false;
    this.selectedProduct = -1;
  }

  protected changePage(currentPage: number): void {
    this.currentPage = currentPage;
    this.searchProducts(this.searchedTerm);
  }

  protected searchProducts(searchedTerm: string): void {
    if (this.searchedTerm !== searchedTerm) {
      this.hasPreviousProducts = false;
    }

    this.searchedTerm = searchedTerm;
    this.productService.
      findActiveByDescriptionContaining(searchedTerm, this.currentPage).pipe(take(1)).subscribe({
        next: (response: Pageable<Product>) => {
          this.updateModalsPerProduct = [];
          this.products = response.content;
          this.totalOfPages = response.totalPages;
          this.products.forEach(() => this.updateModalsPerProduct.push(false));

          if (this.products.length > 0) {
            this.hasPreviousProducts = true;
          }

          if (this.currentPage > this.totalOfPages) {
            this.currentPage = this.totalOfPages;
            this.searchProducts(searchedTerm);
          } else if (this.hasPreviousProducts && this.products.length === 0) {
            this.currentPage = 1;
            this.totalOfPages = 1;
            this.searchedTerm = '';
            this.hasPreviousProducts = false;
          } else if (!this.hasPreviousProducts && this.products.length === 0) {
            this.messageHelper.displayMessage('Não foram encontrados produtos com a descrição indicada!', 'error');
          }

        }
      });
  }

  protected updateProduct(dto: ProductRequest): void {
    this.productService.update(this.products[this.selectedProduct].id, dto).pipe(take(1)).subscribe({
      next: () => {
        this.messageHelper.displayMessage('Produto alterado com sucesso!', 'success');
        this.searchProducts(this.searchedTerm);
      }
    });
  }

  protected deleteProduct(id: number): void {
    this.productService.delete(id).pipe(take(1)).subscribe({
      next: () => {
        this.messageHelper.displayMessage('Produto removido com successo!', 'success');
        this.searchProducts(this.searchedTerm);
      }
    })
  }

}
