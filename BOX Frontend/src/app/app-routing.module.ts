import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { ViewHelpInventoryComponent } from './view-help-inventory/view-help-inventory.component';

const routes: Routes = [
  { path:"", redirectTo:'register', pathMatch:'full' },
  { path:"dashboard", component: DashboardComponent },
  { path:"register", component: RegisterComponent },
  { path:"help", component: ViewHelpInventoryComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
