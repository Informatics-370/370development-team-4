import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { ProductItemTestComponent } from './product-item-test/product-item-test.component';
import { ViewHelpInventoryComponent } from './view-help-inventory/view-help-inventory.component';
import { ProductCategoryComponent } from './product-category/product-category.component';


const routes: Routes = [
  { path:"", redirectTo:'register', pathMatch:'full' },
  { path:"dashboard", component: DashboardComponent },
    { path: "register", component: RegisterComponent },
      { path: "product-item", component: ProductItemTestComponent },
        { path: "help", component: ViewHelpInventoryComponent },
          { path: "product-category", component: ProductCategoryComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
