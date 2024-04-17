import { Routes } from '@angular/router';
import { sessionGuard } from './core/guards/session.guard';
import { superUserGuard } from './core/guards/super-user.guard';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { ActiveProductsPage } from './pages/products/active/active-products.page';
import { InactiveProductsPage } from './pages/products/inactive/inactive-products.page';
import { InsertProductPage } from './pages/products/insert/insert-product.page';
import { SearchProductPage } from './pages/products/search/search-product.page';
import { ActiveSalesPage } from './pages/sales/active/active-sales.page';
import { InsertSalePage } from './pages/sales/insert/insert-sale.page';
import { SearchSalePage } from './pages/sales/search/search-sale.page';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: LoginPage },

    {
        path: 'pdv', canActivateChild: [sessionGuard], children: [
            { path: '', pathMatch: 'full', component: HomePage },
            {
                path: 'products', children: [
                    { path: 'insert', canActivate: [superUserGuard], component: InsertProductPage },
                    { path: 'active', component: ActiveProductsPage },
                    { path: 'inactive', canActivate: [superUserGuard], component: InactiveProductsPage },
                    { path: 'search', component: SearchProductPage }
                ]
            },
            {
                path: 'sales', children: [
                    { path: 'insert', component: InsertSalePage },
                    { path: 'active', component: ActiveSalesPage },
                    { path: 'search', component: SearchSalePage }
                ]
            }
        ]
    }
];
