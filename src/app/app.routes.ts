import { Routes } from '@angular/router';
import { sessionGuard } from './core/guards/session.guard';
import { superUserGuard } from './core/guards/super-user.guard';
import { HomeComponent } from './pages/home/home/home.component';
import { LoginComponent } from './pages/login/login/login.component';
import { ActiveProductsComponent } from './pages/products/active/active-products.component';
import { InactiveProductsComponent } from './pages/products/inactive/inactive-products/inactive-products.component';
import { InsertProductComponent } from './pages/products/insert/insert-product.component';
import { SearchProductComponent } from './pages/products/search/search-product/search-product.component';
import { ActiveSalesComponent } from './pages/sales/active/active-sales.component';
import { InsertSaleComponent } from './pages/sales/insert/insert-sale.component';
import { SearchSaleComponent } from './pages/sales/search/search-sale/search-sale.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: LoginComponent },

    {
        path: 'pdv', canActivateChild: [sessionGuard], children: [
            { path: '', pathMatch: 'full', component: HomeComponent },
            {
                path: 'products', children: [
                    { path: 'insert', canActivate: [superUserGuard], component: InsertProductComponent },
                    { path: 'active', component: ActiveProductsComponent },
                    { path: 'inactive', canActivate: [superUserGuard], component: InactiveProductsComponent },
                    { path: 'search', component: SearchProductComponent }
                ]
            },
            {
                path: 'sales', children: [
                    { path: 'insert', component: InsertSaleComponent },
                    { path: 'active', component: ActiveSalesComponent },
                    { path: 'search', component: SearchSaleComponent }
                ]
            }
        ]
    }
];
