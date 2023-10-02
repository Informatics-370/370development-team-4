import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { CategoryVM } from '../shared/category-vm';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.page.html',
  styleUrls: ['./product-category.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProductCategoryPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  categories: CategoryVM[] = [];
  categoryVM: CategoryVM = {
    categoryDescription: '',
    width: false,
    height: false,
    length: false,
    weight: false,
    volume: false,
    categoryID: 0
  };
  selectedCategory: any = {
    categoryDescription: '',
    length: false,
    width: false,
    height: false,
    weight: false,
    volume: false
  };
  

  editCategory(selectedCategory: any) {
    // Assign the selected category to selectedCategory property
    this.selectedCategory = { ...selectedCategory };
    // Open the edit modal
    this.modalController.create({
      component: 'edit-category-modal',
      componentProps: {
        category: this.selectedCategory
      }
    }).then(modal => {
      modal.present();
    });
  }

  saveEdit() {
    if (this.selectedCategory) {
      // Call the API to update the category
      this.UpdateCategory(this.selectedCategory.categoryID, this.selectedCategory).subscribe(
        (response) => {
          console.log('Category updated successfully:', response);
          this.loadCategories(); // Refresh the category list
          this.modalController.dismiss(null, 'edit');
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  }

  cancelEdit() {
    this.selectedCategory = null;
    this.modalController.dismiss(null, 'cancel');
  }

  private apiUrl = 'http://localhost:5116/api/'
  
  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient, private modalController: ModalController) {}

  ngOnInit() {
    this.loadCategories();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  loadCategories() {
    this.GetCategories().subscribe(
      (data: CategoryVM[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  GetCategories(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ProductCategory/GetAllCategories`)
      .pipe(map(result => result))
  }

  DeleteCategory(categoryId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}ProductCategory/DeleteCategory/${categoryId}`, this.httpOptions);
  }

  UpdateCategory(categoryId: number, categoryVM: CategoryVM): Observable<CategoryVM> {
    return this.httpClient.put<CategoryVM>(`${this.apiUrl}ProductCategory/UpdateCategory/${categoryId}`, categoryVM, this.httpOptions);
  }

  createCategory() {
    this.httpClient.post('http://localhost:5116/api/ProductCategory/AddCategory', this.categoryVM).subscribe(
      (response: any) => {
        console.log('Category added successfully:', response);
        this.modal.dismiss(null, 'create');
      },
      (error) => {
        console.error('Error adding category:', error);
      }
    );
  }

  confirmDeleteCategory(categoryId: number) {
    // Open the delete modal
    this.modalController.create({
      component: 'delete-category-modal',
      componentProps: {
        categoryId: categoryId // Pass the category ID to the modal
      }
    }).then(modal => {
      modal.present();
    });
  }
  
  deleteCategory(categoryId: number) {
    if (categoryId) {
      // Call the API to delete the category
      this.DeleteCategory(categoryId).subscribe(
        () => {
          console.log('Category deleted successfully');
          this.loadCategories(); // Refresh the category list
          this.modalController.dismiss(null, 'delete');
        },
        (error) => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }
 
  

}
