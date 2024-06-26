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

  protected displayModal(selectedProduct: number): void {
    this.updateModalsPerProduct[selectedProduct] = true;
    this.selectedProduct = selectedProduct;
  }

  protected closeModal(): void {
    this.updateModalsPerProduct[this.selectedProduct] = false;
  }

  protected changePage(currentPage: number): void {
    this.currentPage = currentPage;
    this.search(this.searchedTerm);
  }

  protected search(searchedTerm: string): void {
    if (this.searchedTerm !== searchedTerm) {
      this.hasPreviousProducts = false;
    }

    this.products = [];
    this.searchedTerm = searchedTerm;
    this.productService.search(searchedTerm, this.currentPage).pipe(take(1)).subscribe({
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
          this.search(searchedTerm);
        } else if (this.hasPreviousProducts && this.products.length === 0) {
          this.currentPage = 1;
          this.totalOfPages = 1;
          this.searchedTerm = '';
          this.hasPreviousProducts = false;
        } else if (!this.hasPreviousProducts && this.products.length === 0) {
          this.messageHelper.display('Não foram encontrados produtos com a descrição indicada!', 'error');
        }

      }
    });
  }

  protected update(dto: ProductRequest): void {
    this.productService.update(this.products[this.selectedProduct].id, dto).pipe(take(1)).subscribe({
      next: () => {
        this.messageHelper.display('Produto alterado com sucesso!', 'success');
        this.search(this.searchedTerm);
      }
    });
  }

  protected delete(id: number): void {
    this.productService.delete(id).pipe(take(1)).subscribe({
      next: () => {
        this.messageHelper.display('Produto removido com successo!', 'success');
        this.search(this.searchedTerm);
      }
    });
  }

}
