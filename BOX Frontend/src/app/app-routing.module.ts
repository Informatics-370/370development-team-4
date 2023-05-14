import { NgModule, ViewChildren } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewScreenComponent } from './view-screen/view-screen.component';

const routes: Routes = [
  { path: 'Size', component: ViewScreenComponent},
  //{ path: 'edit-course/:id', component: EditcourseComponent },
 // { path: '', redirectTo: 'Size', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
