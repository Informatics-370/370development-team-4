import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewScreenComponent } from './view-screen/view-screen.component';
import { EditScreenComponent } from './edit-screen/edit-screen.component';
import { RouterModule, Routes } from '@angular/router';
import {  HttpClientModule } from '@angular/common/http';

const appRoutes: Routes=[
  { path: 'Size', component: ViewScreenComponent}
]



@NgModule({
  declarations: [
    AppComponent,
    ViewScreenComponent,
    EditScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
