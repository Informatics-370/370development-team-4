import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { EditScreenComponent } from './edit-screen/edit-screen.component';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ViewHelpInventoryComponent } from './view-help-inventory/view-help-inventory.component';
import { ProductItemTestComponent } from './product-item-test/product-item-test.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RefundReasonComponent } from './refund-reason/refund-reason.component';
import { WriteOffReasonComponent } from './write-off-reason/write-off-reason.component';

@NgModule({
  declarations: [ 
    AppComponent,
    DashboardComponent,
        RegisterComponent,
       ProductItemTestComponent,
        ViewHelpInventoryComponent,
        ProductCategoryComponent,
        RefundReasonComponent,
        WriteOffReasonComponent

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
