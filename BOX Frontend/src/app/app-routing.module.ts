import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { ProductItemTestComponent } from './product-item-test/product-item-test.component';

const routes: Routes = [
  { path:"", redirectTo:'register', pathMatch:'full' },
  { path:"dashboard", component: DashboardComponent },
  { path:"register", component: RegisterComponent },
  { path:"product-item", component: ProductItemTestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
