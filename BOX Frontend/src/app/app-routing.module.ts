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
import { EstimateLineComponent } from './estimate/estimate-line.component';
import { LoginComponent } from './login/login.component';
import { CustomerHomepageComponent } from './customer-view/customer-homepage/customer-homepage.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RolesComponent } from './roles/roles.component';


const routes: Routes = [
  { path: "", redirectTo: 'register', pathMatch: 'full' },
  { path: "dashboard", component: DashboardComponent },
  { path: "register", component: RegisterComponent },
  { path: "product-item", component: ProductItemTestComponent },
  { path: "help", component: ViewHelpInventoryComponent },
  { path: "product-category", component: ProductCategoryComponent },
  { path: "return-reason", component: RefundReasonComponent },
  { path: "write-off-reason", component: WriteOffReasonComponent },
  { path: 'size-units', component: SizeUnitsComponent },
  { path: 'vat', component: VatComponent },
  { path: "supplier", component: SupplierComponent },
  { path: "fixed-product", component: FixedProductComponent },
  { path: 'estimate-duration', component: EstimateDurationComponent },
  { path: 'raw-material', component: RawMaterialComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:category', component: ProductsComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent},
  { path: 'cost-price-formula-variables', component: CostPriceFormulaComponent},
  { path: 'cart', component: CartPageComponent },
  { path: 'quotes', component: EstimatePageComponent },
  { path: 'estimates', component: EstimateLineComponent},
  { path: 'login', component: LoginComponent },
  { path: 'customer-homepage', component: CustomerHomepageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'roles', component: RolesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
