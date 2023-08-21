import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Chart } from 'chart.js';

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
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { ProductsComponent } from './customer-view/products/products.component';
import { CategoriesMenuComponent } from './customer-view/categories-menu/categories-menu.component';
import { ProductDetailsComponent } from './customer-view/product-details/product-details.component';
import { CartPageComponent } from './customer-view/cart-page/cart-page.component';
import { EstimateLineComponent } from './estimate/estimate-line.component';
import { EstimatePageComponent } from './customer-view/estimate-page/estimate-page.component';
import { CostPriceFormulaComponent } from './cost-price-formula/cost-price-formula.component';
import { CustomerNavbarComponent } from './customer-view/customer-navbar/customer-navbar.component';
import { LoginComponent } from './login/login.component';
import { CustomerHomepageComponent } from './customer-view/customer-homepage/customer-homepage.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RolesComponent } from './roles/roles.component';
import { SupplierOrderComponent } from './supplier-order/supplier-order.component';
import { SupplierReturnComponent } from './supplier-return/supplier-return.component';
import { DiscountComponent } from './discount/discount.component';
import { StockTakeComponent } from './stock-take/stock-take.component';
import { StockTakeTrailComponent } from './stock-take-trail/stock-take-trail.component';
import { UsersViewComponent } from './users-view/users-view.component';
import { RegistrationSuccessPopupComponent } from './registration-success-popup/registration-success-popup.component';
import { PlaceOrderComponent } from './customer-view/place-order/place-order.component';
import { OrderHistoryComponent } from './customer-view/order-history/order-history.component';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { CustomProdComponent } from './custom-prod/custom-prod.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { FooterComponent } from './footer/footer.component';
import { TwoFactorAuthComponent } from './two-factor-auth/two-factor-auth.component';
import { EmployeesComponent } from './employees/employees.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { AssignEmployeeComponent } from './assign-employee/assign-employee.component';
import { MyQuotesComponent } from './customer-view/my-quotes/my-quotes.component';
import { QouteRequestsComponent } from './qoute-requests/qoute-requests.component';
import { GenerateQuoteComponent } from './generate-quote/generate-quote.component';
import { SalesByCategoryReportComponent } from './sales-by-category-report/sales-by-category-report.component';
import { ReviewReportComponent } from './review-report/review-report.component';
import { WriteOffByProductCategoryComponent } from './write-off-by-product-category/write-off-by-product-category.component';


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
        RawMaterialComponent,
        ProductsComponent,
        CategoriesMenuComponent,
        ProductDetailsComponent,
        CartPageComponent,
        EstimateLineComponent,
        EstimatePageComponent,
        CostPriceFormulaComponent,
        CustomerNavbarComponent,
        LoginComponent,
        CustomerHomepageComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        RolesComponent,
        SupplierOrderComponent,
        SupplierReturnComponent,
        RolesComponent,
        DiscountComponent,
        StockTakeComponent,
        StockTakeTrailComponent,
        UsersViewComponent,
        PlaceOrderComponent,
        OrderHistoryComponent,
        CustomerOrdersComponent,
        RegistrationSuccessPopupComponent,
        CustomProdComponent,
        ConfirmEmailComponent,
        FooterComponent,
        TwoFactorAuthComponent,
        EmployeesComponent,
        ProfilePageComponent,
        AssignEmployeeComponent,
        MyQuotesComponent,
        QouteRequestsComponent,
        GenerateQuoteComponent,
        SalesByCategoryReportComponent,
        ReviewReportComponent,
        WriteOffByProductCategoryComponent
        
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
