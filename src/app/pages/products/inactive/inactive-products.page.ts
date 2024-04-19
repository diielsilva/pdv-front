import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { take } from 'rxjs';
import { PaginatorComponent } from '../../../common/components/paginator/paginator.component';
import { InactiveProductCardComponent } from '../../../common/components/products/inactive-product-card/inactive-product-card.component';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product.service';
import { Pageable } from '../../../core/utils/pageable';

@Component({
  selector: 'app-inactive-products',
  standalone: true,
  imports: [PaginatorComponent, PanelModule, ButtonModule, InactiveProductCardComponent],
  templateUrl: './inactive-products.page.html',
  styleUrl: './inactive-products.page.css'
})
export class InactiveProductsPage implements OnInit {
  protected products: Product[] = [];
  protected currentPage: number = 1;
  protected totalOfPages: number = 1;

  public constructor(
    protected productService: ProductService,
    protected loadingHelper: LoadingHelper,
    protected messageHelper: MessageHelper
  ) { }

  public ngOnInit(): void {
    this.findInactive();
  }

  protected changePage(currentPage: number): void {
    this.currentPage = currentPage;
    this.findInactive();
  }

  protected findInactive(): void {
    this.productService.findInactive(this.currentPage).pipe(take(1)).subscribe({
      next: (response: Pageable<Product>) => {
        this.totalOfPages = response.totalPages;
        this.products = response.content;

        if (this.currentPage > this.totalOfPages) {
          this.currentPage = this.totalOfPages;
          this.findInactive();
        }
      },
    });
  }

  protected reactivate(id: number): void {
    this.productService.reactivate(id).pipe(take(1)).subscribe({
      next: () => {
        this.messageHelper.display('Produto reativado com sucesso!', 'success');
        this.findInactive();
      }
    });
  }
}
