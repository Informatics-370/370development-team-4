import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { ProductItemTestComponent } from './product-item-test/product-item-test.component';
import { ViewHelpInventoryComponent } from './view-help-inventory/view-help-inventory.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { RefundReasonComponent } from './refund-reason/refund-reason.component';
import { WriteOffReasonComponent } from './write-off-reason/write-off-reason.component';
import { SizeUnitsComponent } from './size-units/size-units.component';
import { VatComponent } from './vat/vat.component';
import { SupplierComponent } from './supplier/supplier.component';
import { FixedProductComponent } from './fixed-product/fixed-product.component';
import { EstimateDurationComponent } from './estimate-duration/estimate-duration.component';
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { ProductsComponent } from './customer-view/products/products.component';
import { ProductDetailsComponent } from './customer-view/product-details/product-details.component';
import { CartPageComponent } from './customer-view/cart-page/cart-page.component';
import { EstimatePageComponent } from './customer-view/estimate-page/estimate-page.component';
import { CostPriceFormulaComponent } from './cost-price-formula/cost-price-formula.component';
import { LoginComponent } from './login/login.component';
import { CustomerHomepageComponent } from './customer-view/customer-homepage/customer-homepage.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RolesComponent } from './roles/roles.component';
import { EstimateLineComponent } from './estimate/estimate-line.component';
import { SupplierOrderComponent } from './supplier-order/supplier-order.component';
import { SupplierReturnComponent } from './supplier-return/supplier-return.component';
import { DiscountComponent } from './discount/discount.component';
import { StockTakeComponent } from './stock-take/stock-take.component';
import { StockTakeTrailComponent } from './stock-take-trail/stock-take-trail.component';
import{UsersViewComponent}from'./users-view/users-view.component';
import { RoleAuthGuard } from './role-auth.guard';
import { PlaceOrderComponent } from './customer-view/place-order/place-order.component';
import { OrderHistoryComponent } from './customer-view/order-history/order-history.component';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';


const routes: Routes = [
  { path: "", redirectTo: 'register', pathMatch: 'full' },
  { path: "dashboard", component: DashboardComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']} },
  { path: "register", component: RegisterComponent },
  { path: "product-item", component: ProductItemTestComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}  },
  { path: "help", component: ViewHelpInventoryComponent },
  { path: "product-category", component: ProductCategoryComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}  },
  { path: "return-reason", component: RefundReasonComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}  },
  { path: "write-off-reason", component: WriteOffReasonComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}  },
  { path: 'size-units', component: SizeUnitsComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}  },
  { path: 'vat', component: VatComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}  },
  { path: "supplier", component: SupplierComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}  },
  { path: "fixed-product", component: FixedProductComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}  },
  { path: 'estimate-duration', component: EstimateDurationComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}  },
  { path: 'raw-material', component: RawMaterialComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}  },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:category', component: ProductsComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'cost-price-formula-variables', component: CostPriceFormulaComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'quotes', component: EstimatePageComponent },
  { path: 'estimates', component: EstimateLineComponent },
  { path: 'products/:category', component: ProductsComponent  },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'cost-price-formula-variables', component: CostPriceFormulaComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']} },
  { path: 'cart', component: CartPageComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Customer']} },
  { path: 'estimate', component: EstimatePageComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Customer']} },
  { path: 'estimates', component: EstimateLineComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}},
  { path: 'login', component: LoginComponent },
  { path: 'customer-homepage', component: CustomerHomepageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'supplier-order',component:SupplierOrderComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']} },
  { path: 'supplier-return',component:SupplierReturnComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']} },
  { path: 'roles', component: RolesComponent },
  { path: 'discount', component: DiscountComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']}  },
  { path: 'stock-take', component: StockTakeComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']} },
  { path: 'stock-take-trail', component: StockTakeTrailComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']} },
  {path: 'users',component: UsersViewComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin']} },
  { path: 'place-order', component: PlaceOrderComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'order-history/:success', component: OrderHistoryComponent },
  { path: 'customer-orders', component: CustomerOrdersComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
