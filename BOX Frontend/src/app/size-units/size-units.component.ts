import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { Category } from '../shared/category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Size } from '../shared/Size';

@Component({
  selector: 'app-size-units',
  templateUrl: './size-units.component.html',
  styleUrls: ['./size-units.component.css']
})
export class SizeUnitsComponent {
  sizeUnits: Size[] = []; //used to store all size units
  filteredSizeUnits: Size[] = []; //used to hold all the sizes that will be displayed to the user
  specificSize!: Size; //used to get a specific size (not always necessary)
  sizeCount: number = this.filteredSizeUnits.length; //keep track of how many sizes there are in the DB
  //forms
  /* addSizeForm: FormGroup;
  updateSizeForm: FormGroup; */
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';
}
