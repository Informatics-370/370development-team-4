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
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { ProductsComponent } from './customer-view/products/products.component';
import { ProductDetailsComponent } from './customer-view/product-details/product-details.component';
import { CartPageComponent } from './customer-view/cart-page/cart-page.component';
import { CostPriceFormulaComponent } from './cost-price-formula/cost-price-formula.component';
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
import { RoleAuthGuard } from './role-auth.guard';
import { PlaceOrderComponent } from './customer-view/place-order/place-order.component';
import { OrderHistoryComponent } from './customer-view/order-history/order-history.component';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { CustomProdComponent } from './custom-prod/custom-prod.component';
import { MyQuotesComponent } from './customer-view/my-quotes/my-quotes.component';
import { QouteRequestsComponent } from './qoute-requests/qoute-requests.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { TwoFactorAuthComponent } from './two-factor-auth/two-factor-auth.component';
import { EmployeesComponent } from './employees/employees.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { AssignEmployeeComponent } from './assign-employee/assign-employee.component';
import { SalesByCategoryReportComponent } from './sales-by-category-report/sales-by-category-report.component';
import { ProductListReportComponent } from './product-list-report/product-list-report.component';
import { InactiveCustomerListComponent } from './inactive-customer-list/inactive-customer-list.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { ReviewReportComponent } from './review-report/review-report.component';
import { WriteOffByProductCategoryComponent } from './write-off-by-product-category/write-off-by-product-category.component';
import { InventoryChartComponent } from './inventory-chart/inventory-chart.component';
import { MessagesComponent } from './messages/messages.component';
import { OrderDeliveryScheduleComponent } from './order-delivery-schedule/order-delivery-schedule.component';
import { OrderDelCalendarComponent } from './order-del-calendar/order-del-calendar.component';
import { QuotesComponent } from './quotes/quotes.component';


const routes: Routes = [
  { path: "", redirectTo: 'customer-homepage', pathMatch: 'full' },
  { path: "dashboard", component: DashboardComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: "register", component: RegisterComponent },
  { path: "register/:redirectTo", component: RegisterComponent },
  { path: "product-item", component: ProductItemTestComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: "help", component: ViewHelpInventoryComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: "product-category", component: ProductCategoryComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: "return-reason", component: RefundReasonComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: "write-off-reason", component: WriteOffReasonComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'size-units', component: SizeUnitsComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'vat', component: VatComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: "supplier", component: SupplierComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: "fixed-product", component: FixedProductComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'raw-material', component: RawMaterialComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:category', component: ProductsComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'cost-price-formula-variables', component: CostPriceFormulaComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'login', component: LoginComponent },
  { path: 'login/:redirectTo', component: LoginComponent },
  { path: 'customer-homepage', component: CustomerHomepageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'supplier-order', component: SupplierOrderComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'supplier-return', component: SupplierReturnComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'roles', component: RolesComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'discount', component: DiscountComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'stock-take', component: StockTakeComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'stock-take-trail', component: StockTakeTrailComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'users', component: UsersViewComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'place-order/:quoteID', component: PlaceOrderComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'manage-orders', component: CustomerOrdersComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'custom-product', component: CustomProdComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'two-factor-auth', component: TwoFactorAuthComponent },
  { path: 'employees', component: EmployeesComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'profile-page', component: ProfilePageComponent },
  { path: 'my-quotes', component: MyQuotesComponent },
  { path: 'quote-requests', component: QouteRequestsComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'sales-by-category', component: SalesByCategoryReportComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'product-list', component: ProductListReportComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'inactive-customers', component: InactiveCustomerListComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'assign-employee', component: AssignEmployeeComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'supplier-list', component: SupplierListComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'review-report', component: ReviewReportComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'write-off-report', component: WriteOffByProductCategoryComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'inventory-chart', component: InventoryChartComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'messages', component: MessagesComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'order-schedule', component: OrderDeliveryScheduleComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'order-calendar', component: OrderDelCalendarComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} },
  { path: 'manage-quotes', component: QuotesComponent, canActivate: [RoleAuthGuard], data: { allowedRoles: ['Admin', 'Employee']} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
