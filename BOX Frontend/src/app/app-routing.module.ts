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


const routes: Routes = [
  { path:"", redirectTo:'register', pathMatch:'full' },
  { path:"dashboard", component: DashboardComponent },
    { path: "register", component: RegisterComponent },
      { path: "product-item", component: ProductItemTestComponent },
        { path: "help", component: ViewHelpInventoryComponent },
          { path: "product-category", component: ProductCategoryComponent },
          {path: "refund-reason", component: RefundReasonComponent},
          {path: "write-off-reason", component: WriteOffReasonComponent},
          {path: 'size-units', component: SizeUnitsComponent},
    { path: 'vat', component: VatComponent },
    { path: "supplier", component: SupplierComponent },
    { path: "fixed-product", component: FixedProductComponent },
          {path: 'estimate-duration', component: EstimateDurationComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
