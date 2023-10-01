import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Supplier } from '../shared/supplier';
import { Category } from '../shared/category';
import { SupplierVM } from '../shared/supplier-vm';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.page.html',
  styleUrls: ['./supplier.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class SupplierPage implements OnInit {
  name: string = '';
  address: string = '';
  phone_Number: string = '';
  email: string = '';
  suppliers: Supplier[] = [];
  updateName: string = '';
  updateAddress: string = '';
  updatePhone_Number: string = '';
  updateEmail: string = '';
  selectedSupplier: any = {};
  
  constructor(private httpClient: HttpClient, private modalController: ModalController) {}
  
  ngOnInit(): void {
    this.loadSuppliers();
  }

  apiUrl = 'http://localhost:5116/api/'

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  GetCategories(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ProductCategory/GetAllCategories`)
      .pipe(map(result => result))
  }

  GetAllSuppliers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Supplier/GetAllSuppliers`).pipe(map((result) => result));
  }

  GetSupplier(supplierId: number): Observable<any> {
    return this.httpClient.get<Supplier>(`${this.apiUrl}Supplier/GetSupplier/${supplierId}`).pipe(map((result) => result));
  }

  AddSupplier(svm: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}Supplier/AddSupplier`, svm, this.httpOptions);
  }

  DeleteSupplier(supplierId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}Supplier/DeleteSupplier/${supplierId}`, this.httpOptions);
  }

  UpdateSupplier(supplierId: number, svm: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}Supplier/UpdateSupplier/${supplierId}`, svm, this.httpOptions);
  }

  loadSuppliers() {
    this.GetAllSuppliers().subscribe(
      (response) => {
        // Assuming the API response is an array of suppliers
        this.suppliers = response;
      },
      (error) => {
        // Handle API error, e.g., show an error message
        console.error('Error fetching suppliers:', error);
      }
    );
  }

  createSupplier() {
    // Gather data from the input fields
    const supplierData = {
      name: this.name,
      address: this.address,
      phone_Number: this.phone_Number,
      email: this.email
    };

    // Call the AddSupplier API
    this.AddSupplier(supplierData).subscribe(
      (response) => {
        // Handle the API response here, e.g., show a success message or close the modal
        console.log('Supplier added successfully:', response);

        // Close the modal
        this.modalController.dismiss();
      },
      (error) => {
        // Handle API error, e.g., show an error message
        console.error('Error adding supplier:', error);
      }
    );
  }

  openUpdateModal() {
    this.GetSupplier
  }  

  dismissModal() {
    this.modalController.dismiss();
  }
}
