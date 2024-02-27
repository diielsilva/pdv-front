import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  protected router = inject(Router)
  protected authService = inject(AuthService)
  protected commonUserItems: MenuItem[] = [
    {
      label: 'Produtos',
      items: [
        {
          label: 'Ativos',
          command: () => this.router.navigate(['/pdv/products/active'])
        },
        {
          label: 'Pesquisar',
          command: () => this.router.navigate(['/pdv/products/search'])
        }
      ]
    },
    {
      label: 'Vendas',
      items: [
        { label: 'Cadastrar', command: () => this.router.navigate(['/pdv/sales/insert']) },
        { label: 'Ativas', command: () => this.router.navigate(['/pdv/sales/active']) },
        { label: 'Pesquisar', command: () => this.router.navigate(['/pdv/sales/search']) }
      ]
    },
    {

      label: 'Sair',
      command: () => this.router.navigate([''])
    }
  ]
  protected superUserItems: MenuItem[] = [
    {
      label: 'Produtos',
      items: [
        {
          label: 'Cadastrar',
          command: () => this.router.navigate(['/pdv/products/insert'])
        },
        {
          label: 'Ativos',
          command: () => this.router.navigate(['/pdv/products/active'])
        },
        {
          label: 'Inativos',
          command: () => this.router.navigate(['/pdv/products/inactive'])
        },
        {
          label: 'Pesquisar',
          command: () => this.router.navigate(['/pdv/products/search'])
        }
      ]
    },
    {
      label: 'Vendas',
      items: [
        { label: 'Cadastrar', command: () => this.router.navigate(['/pdv/sales/insert']) },
        { label: 'Ativas', command: () => this.router.navigate(['/pdv/sales/active']) },
        { label: 'Pesquisar', command: () => this.router.navigate(['/pdv/sales/search']) }
      ]
    },
    {
      label: 'Sair',
      command: () => this.router.navigate([''])
    }
  ]
}
