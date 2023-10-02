import { Routes } from '@angular/router';
import { ReportingPage } from './reporting/reporting.page';
import { WriteOffPage } from './write-off/write-off.page';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { SalesByCategoryComponent } from './sales-by-category/sales-by-category.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { ProductListComponent } from './product-list/product-list.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'unauthorised',
    loadComponent: () => import('./unauthorised/unauthorised.page').then( m => m.UnauthorisedPage)
  }, 
  {
    path: 'reporting',
    loadComponent: () => import('./reporting/reporting.page').then( m => m.ReportingPage),
    children: [
      { path: 'customer-service', component: CustomerServiceComponent },
      { path: 'sales-by-category', component: SalesByCategoryComponent },
      { path: 'supplier-list', component: SupplierListComponent },
      { path: 'product-list', component: ProductListComponent },
    ]
  },
  {
    path: 'write-off',
    loadComponent: () => import('./write-off/write-off.page').then( m => m.WriteOffPage)
  },
  {
    path: 'stock-take-trail',
    loadComponent: () => import('./stock-take-trail/stock-take-trail.page').then( m => m.StockTakeTrailPage)
  },
  {
    path: 'supplier',
    loadComponent: () => import('./supplier/supplier.page').then( m => m.SupplierPage)
  },
  {
    path: 'supplier-order',
    loadComponent: () => import('./supplier-order/supplier-order.page').then( m => m.SupplierOrderPage)
  },
  {
    path: 'product-category',
    loadComponent: () => import('./product-category/product-category.page').then( m => m.ProductCategoryPage)
  },
  {
    path: 'size-units',
    loadComponent: () => import('./size-units/size-units.page').then( m => m.SizeUnitsPage)
  },
  {
    path: 'fixed-products',
    loadComponent: () => import('./fixed-products/fixed-products.page').then( m => m.FixedProductsPage)
  },
  {
    path: 'write-off-reasons',
    loadComponent: () => import('./write-off-reasons/write-off-reasons.page').then( m => m.WriteOffReasonsPage)
  },
  {
    path: 'product-category',
    loadComponent: () => import('./product-category/product-category.page').then( m => m.ProductCategoryPage)
  },

   
];
