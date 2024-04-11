import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { PaginatorComponent } from '../../../common/components/paginator/paginator.component';
import { ActiveProductCardComponent } from '../../../common/components/products/active-product-card/active-product-card.component';
import { UpdateProductModalComponent } from '../../../common/components/products/update-product-modal/update-product-modal.component';
import { ProductRequest } from '../../../common/dtos/products/product.request';
import { LoadingHelper } from '../../../common/helpers/loading.helper';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { SubscriptionHelper } from '../../../common/helpers/subscription.helper';
import { Product } from '../../../core/models/product';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { ReportService } from '../../../core/services/report.service';
import { Pageable } from '../../../core/utils/pageable';

//TODO IMPLEMENTS PAGINATION AGAIN AND ADD SUBSCRIPTION CLEAN
@Component({
  selector: 'app-active-products',
  standalone: true,
  imports: [PanelModule, ButtonModule, PaginatorComponent, ActiveProductCardComponent, UpdateProductModalComponent],
  templateUrl: './active-products.component.html',
  styleUrl: './active-products.component.css'
})
export class ActiveProductsComponent implements OnInit {
  protected products: Product[] = [];
  protected updateModalsPerProduct: boolean[] = [];
  protected selectedProduct: number = -1;

  public constructor(
    protected productService: ProductService,
    protected reportService: ReportService,
    protected authService: AuthService,
    protected subscriptionHelper: SubscriptionHelper,
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

  protected closeModalFromSelectedProduct(): void {
    this.updateModalsPerProduct[this.selectedProduct] = false;
  }

  protected findActiveProducts(): void {
    this.productService.findActive(1).subscribe({
      next: (response: Pageable<Product>) => {
        this.selectedProduct = -1;
        this.updateModalsPerProduct = [];
        this.products = response.content;
        this.products.forEach(() => this.updateModalsPerProduct.push(false));
      }
    });
  }

  protected updateProduct(dto: ProductRequest): void {
    this.productService.update(this.products[this.selectedProduct].id, dto).subscribe({
      next: () => {
        this.messageHelper.displayMessage('Produto editado com sucesso!', 'success');
        this.findActiveProducts();
      }
    });
  }

  protected deleteProduct(id: number): void {
    this.productService.delete(id).subscribe({
      next: () => {
        this.messageHelper.displayMessage('Produto removido com sucesso!', 'success');
        this.findActiveProducts();
      }
    })
  }

}
