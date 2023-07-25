import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ViewHelpInventoryComponent } from './view-help-inventory/view-help-inventory.component';
import { ProductItemTestComponent } from './product-item-test/product-item-test.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RefundReasonComponent } from './refund-reason/refund-reason.component';
import { WriteOffReasonComponent } from './write-off-reason/write-off-reason.component';
import { SizeUnitsComponent } from './size-units/size-units.component';
import { VatComponent } from './vat/vat.component';
import { MenuComponent } from './menu/menu.component';
import { SupplierComponent } from './supplier/supplier.component';
import { StartupDivComponent } from './startup-div/startup-div.component';
import { FixedProductComponent } from './fixed-product/fixed-product.component';
import { EstimateDurationComponent } from './estimate-duration/estimate-duration.component';
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { ProductsComponent } from './customer-view/products/products.component';
import { CategoriesMenuComponent } from './customer-view/categories-menu/categories-menu.component';
import { ProductDetailsComponent } from './customer-view/product-details/product-details.component';
import { CartPageComponent } from './customer-view/cart-page/cart-page.component';
import { EstimateLineComponent } from './estimate/estimate-line.component';
import { EstimatePageComponent } from './customer-view/estimate-page/estimate-page.component';
import { CostPriceFormulaComponent } from './cost-price-formula/cost-price-formula.component';
import { EstimateDetailsComponent } from './estimate-details/estimate-details.component';

@NgModule({
  declarations: [ 
    AppComponent,
    DashboardComponent,
        RegisterComponent,
       ProductItemTestComponent,
        ViewHelpInventoryComponent,
        ProductCategoryComponent,
        RefundReasonComponent,
        WriteOffReasonComponent,
        SizeUnitsComponent,
        VatComponent,
        ProductCategoryComponent,
        MenuComponent,
        SupplierComponent,
        StartupDivComponent,
        FixedProductComponent,
        EstimateDurationComponent,
        RawMaterialComponent,
        ProductsComponent,
        CategoriesMenuComponent,
        ProductDetailsComponent,
        CartPageComponent,
        EstimateLineComponent,
        EstimatePageComponent,
        CostPriceFormulaComponent,
        EstimateDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
