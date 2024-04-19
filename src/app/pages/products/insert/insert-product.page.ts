import { Component } from '@angular/core';
import { take } from 'rxjs';
import { InsertProductFormComponent } from '../../../common/components/products/insert-product-form/insert-product-form.component';
import { ProductRequest } from '../../../common/dtos/products/product.request';
import { MessageHelper } from '../../../common/helpers/message.helper';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-insert-product',
  standalone: true,
  imports: [InsertProductFormComponent],
  templateUrl: './insert-product.page.html',
  styleUrl: './insert-product.page.css'
})
export class InsertProductPage {

  public constructor(
    protected productService: ProductService,
    protected messageHelper: MessageHelper
  ) { }

  public save(dto: ProductRequest): void {
    this.productService.save(dto).pipe(take(1)).subscribe({
      next: () => {
        this.messageHelper.display('Produto cadastrado com sucesso!', 'success');
      },
    });
  }

}
