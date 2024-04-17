import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { take } from 'rxjs';
import { PaginatorComponent } from '../../../common/components/paginator/paginator.component';
import { ActiveProductCardComponent } from '../../../common/components/products/active-product-card/active-product-card.component';
import { UpdateProductModalComponent } from '../../../common/components/products/update-product-modal/update-product-modal.component';
import { ProductRequest } from '../../../common/dtos/products/product.request';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product.service';
import { ReportService } from '../../../core/services/report.service';
import { SecurityService } from '../../../core/services/security.service';
import { Pageable } from '../../../core/utils/pageable';

@Component({
  selector: 'app-active-products',
  standalone: true,
  imports: [PanelModule, ButtonModule, PaginatorComponent, ActiveProductCardComponent, UpdateProductModalComponent, PaginatorComponent],
  templateUrl: './active-products.page.html',
  styleUrl: './active-products.page.css'
})
export class ActiveProductsPage implements OnInit {
  protected products: Product[] = [];
  protected updateModalsPerProduct: boolean[] = [];
  protected selectedProduct: number = -1;
  protected currentPage: number = 1;
  protected totalOfPages: number = 1;

  public constructor(
    protected productService: ProductService,
    protected reportService: ReportService,
    protected securityService: SecurityService,
    protected loadingHelper: LoadingHelper,
    protected messageHelper: MessageHelper
  ) { }

  public ngOnInit(): void {
    this.findActiveProducts();
  }

  protected displayUpdateModal(selectedProduct: number): void {
    this.updateModalsPerProduct[selectedProduct] = true;
    this.selectedProduct = selectedProduct;
  }

  protected closeUpdateModal(): void {
    this.updateModalsPerProduct[this.selectedProduct] = false;
  }

  protected changePage(page: number): void {
    this.currentPage = page;
    this.findActiveProducts();
  }

  protected findActiveProducts(): void {
    this.productService.findActive(this.currentPage).pipe(take(1)).subscribe({
      next: (response: Pageable<Product>) => {
        this.selectedProduct = -1;
        this.updateModalsPerProduct = [];
        this.products = response.content;
        this.products.forEach(() => this.updateModalsPerProduct.push(false));
        this.totalOfPages = response.totalPages;

        if (this.currentPage > this.totalOfPages) {
          this.currentPage = this.totalOfPages;
          this.findActiveProducts();
        }

      }
    });
  }

  protected updateProduct(dto: ProductRequest): void {
    this.productService.update(this.products[this.selectedProduct].id, dto).pipe(take(1)).subscribe({
      next: () => {
        this.messageHelper.displayMessage('Produto editado com sucesso!', 'success');
        this.findActiveProducts();
      }
    });
  }

  protected deleteProduct(id: number): void {
    this.productService.delete(id).pipe(take(1)).subscribe({
      next: () => {
        this.messageHelper.displayMessage('Produto removido com sucesso!', 'success');
        this.findActiveProducts();
      }
    });
  }

  protected generateInventoryReport(): void {
    this.reportService.generateGoodsReport().pipe(take(1)).subscribe({
      next: (response: Blob) => {
        const reportWindow = window.URL.createObjectURL(response);
        window.open(reportWindow);
      }
    });
  }

}
