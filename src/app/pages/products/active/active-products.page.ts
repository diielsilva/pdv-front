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
  protected modalsPerProduct: boolean[] = [];
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
    this.findActive();
  }

  protected displayModal(selectedProduct: number): void {
    this.modalsPerProduct[selectedProduct] = true;
    this.selectedProduct = selectedProduct;
  }

  protected closeModal(): void {
    this.modalsPerProduct[this.selectedProduct] = false;
  }

  protected changePage(page: number): void {
    this.currentPage = page;
    this.findActive();
  }

  protected findActive(): void {
    this.products = [];
    this.productService.findActive(this.currentPage).pipe(take(1)).subscribe({
      next: (response: Pageable<Product>) => {
        this.modalsPerProduct = [];
        this.products = response.content;
        this.products.forEach(() => this.modalsPerProduct.push(false));
        this.totalOfPages = response.totalPages;

        if (this.currentPage > this.totalOfPages) {
          this.currentPage = this.totalOfPages;
          this.findActive();
        }

      }
    });
  }

  protected update(dto: ProductRequest): void {
    this.productService.update(this.products[this.selectedProduct].id, dto).pipe(take(1)).subscribe({
      next: () => {
        this.messageHelper.display('Produto editado com sucesso!', 'success');
        this.findActive();
      }
    });
  }

  protected delete(id: number): void {
    this.productService.delete(id).pipe(take(1)).subscribe({
      next: () => {
        this.messageHelper.display('Produto removido com sucesso!', 'success');
        this.findActive();
      }
    });
  }

  protected inventoryReport(): void {
    this.reportService.inventoryReport().pipe(take(1)).subscribe({
      next: (response: Blob) => {
        const reportWindow: string = window.URL.createObjectURL(response);
        window.open(reportWindow);
      }
    });
  }

}
