import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { CategoryVM } from '../shared/category-vm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Size } from '../shared/Size';
import { SizeVM } from '../shared/size-vm';
import { TableSizeVM } from '../shared/tablesizeVM';
import { ValidatorFn } from '@angular/forms';


declare var $: any;

@Component({
  selector: 'app-size-units',
  templateUrl: './size-units.component.html',
  styleUrls: ['./size-units.component.css']
})
export class SizeUnitsComponent {
  sizeUnits: SizeVM[] = [];
  filteredSizeUnits: TableSizeVM[] = [];
  sizeholder:TableSizeVM[] = [];
  sizes: SizeVM[] = [];

  specificSize!: Size;
  sizeCount: number = -1;
  categoryCount: number = -1;
  categories: CategoryVM[] = [];

  addSizeForm: FormGroup;
  updateSizeForm: FormGroup;
  isDisabled = true;
  public selectedValue = 'NA';

  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;

  searchTerm: string = '';
  submitClicked = false;
  loading = true;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addSizeForm = this.formBuilder.group({
      sizeLength: [0, [Validators.required, this.allowZero()]],
      sizeWidth: [0, [Validators.required, this.allowZero()]],
      sizeHeight: [0, [Validators.required, this.allowZero()]],
      sizeWeight: [0, [Validators.required, this.allowZero()]],
      sizeVolume: [0, [Validators.required, this.allowZero()]],
      categoryID: [{ value: 'NA' }, Validators.required]
    });
    

    this.updateSizeForm = this.formBuilder.group({
      usizeLength: [0, Validators.required],
      usizeWidth: [0, Validators.required],
      usizeHeight: [0, Validators.required],
      usizeWeight: [0, Validators.required],
      usizeVolume: [0, Validators.required],
      uCategoryID: [{ value: '7' }, Validators.required]
      /*uCategoryID: [{ value: '7', disabled: true }, Validators.required] */
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getSizes();

  }

  getSizes() {
    this.dataService.GetSizes().subscribe((result: any[]) => {
      this.sizeUnits = result.map((size: SizeVM) => {
        return {
          sizeID: size.sizeID,
          width: size.width,
          length: size.length,
          weight: size.weight,
          height: size.height,
          volume: size.volume,
          categoryID: size.categoryID,
          categoryDescription: size.categoryDescription
        };
      });

      this.sizeCount = this.sizeUnits.length;

      this.sizes = this.sizeUnits;

      console.log('All Size Units array: ', this.sizeUnits);

      this.formatSizes();
    });
  }
  allowZero(): ValidatorFn {
    return (control) => {
      const value = control.value;
      if (value === 0 || value === '0') {
        return null; // Return null for valid value
      } else if (value > 0) {
        return null; // Return null for non-zero positive value
      }
      return { 'invalidValue': true }; // Return an error object for invalid value
    };
  }
  

  getCategories() {
    this.dataService.GetCategories().subscribe((result: any[]) => {
      let allCategories: any[] = result;
      this.categories = [];
      allCategories.forEach((category) => {
        this.categories.push(category);
      });

      console.log('All categories array: ', this.categories);
      this.loading = false;
      this.formatSizes();
      this.formatInputFieldsAdd();
      this.formatInputFieldsUpdate();

    });
  }

  searchSizeUnits(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredSizeUnits = [];
    for (let i = 0; i < this.sizeUnits.length; i++) {
      let notCaseSensitive: string = String(
        this.sizeUnits[i].categoryDescription +
        this.sizeUnits[i].height +
        this.sizeUnits[i].weight +
        this.sizeUnits[i].length +
        this.sizeUnits[i].volume +
        this.sizeUnits[i].width
      ).toLowerCase();
      if (notCaseSensitive.includes(this.searchTerm.toLowerCase())) {
        this.sizeholder.forEach(element => {
          if(this.sizeUnits[i].sizeID==element.sizeID)
          this.filteredSizeUnits.push(element)
        });
      }
    }
    this.sizeCount = this.filteredSizeUnits.length;
    console.log(this.sizeholder);
  }

  addSize() {
    this.submitClicked = true;
    if (this.addSizeForm.valid) {
      const formData = this.addSizeForm.value;
      let newSize: SizeVM = {
        
        sizeID: 0,
        width: formData.sizeWidth ,
        length: formData.sizeLength ,
        weight: formData.sizeWeight ,
        height: formData.sizeHeight ,
        volume: formData.sizeVolume ,
        categoryID: parseInt(formData.categoryID),
        categoryDescription: ''
        
      };
  
      console.log(newSize);
  
      this.dataService.AddSize(newSize).subscribe(
        (result: any) => {
          console.log('New Size Unit Created with the correct Category!', result);
  
          newSize.sizeID = result.sizeID; 
          this.sizeUnits.push(newSize);
          this.formatSizes();  
          this.addSizeForm.reset();
          this.selectedValue='NA';
          this.formatInputFieldsAdd();

          this.submitClicked = false;
          $('#addSize').modal('hide');
          console.log('All Size Units array: ', this.sizeUnits);
  
          // Fetch the updated size units
          this.getSizes();
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
      );
    } else {
      console.log('Invalid data');
    }
  }
  
  

  openDeleteModal(sizeId: number) {
    this.dataService.getSize(sizeId).subscribe(
      (result) => {
        console.log(this.specificSize);
        const deleteDescription = document.getElementById('deleteDescription');
        if (deleteDescription) deleteDescription.innerHTML = result.categoryDescription + "-" + result.length + "X" + result.width + "X" + result.height + "X" + result.weight + "X" + result.volume;

        this.deleteModal.nativeElement.classList.add('show');
        this.deleteModal.nativeElement.style.display = 'block';
        this.deleteModal.nativeElement.id = 'deleteSize-' + sizeId;

        const backdrop = document.getElementById("backdrop");
        if (backdrop) { backdrop.style.display = "block" };
        document.body.style.overflow = 'hidden';
      }
    );
  }

  closeDeleteModal() {
    this.deleteModal.nativeElement.classList.remove('show');
    this.deleteModal.nativeElement.style.display = 'none';

    const backdrop = document.getElementById("backdrop");
    if (backdrop) { backdrop.style.display = "none" };
    document.body.style.overflow = 'auto';
  }

  deleteSize() {
    let id = this.deleteModal.nativeElement.id;
    let sizeId = id.substring(id.indexOf('-') + 1);
    console.log(sizeId);
    this.dataService.DeleteSize(sizeId).subscribe(
      (result) => {
        console.log("Successfully deleted ", result);
        this.getSizes();
      },
      (error) => {
        console.error('Error deleting item with ID ', sizeId, error);
      }
    );

    this.closeDeleteModal();
  }

  openUpdateModal(sizeId: number) {
    this.dataService.getSize(sizeId).subscribe(
      (result) => {
        console.log('Size to update: ', result);
        this.updateSizeForm.setValue({
          uCategoryID: result.categoryID,
          usizeLength: result.length,
          usizeHeight: result.height,
          usizeWidth: result.width,
          usizeWeight: result.weight,
          usizeVolume: result.volume,

        });

        this.updateModal.nativeElement.classList.add('show');
        this.updateModal.nativeElement.style.display = 'block';
        this.updateModal.nativeElement.id = 'updateSize-' + sizeId;

        const backdrop = document.getElementById("backdrop");
if (backdrop) { backdrop.style.display = "block" };
        document.body.style.overflow = 'hidden';
        this.formatInputFieldsUpdate();

      },
      (error) => {
        console.error(error);
      }
      
    );
  }

  closeUpdateModal() {
    this.updateModal.nativeElement.classList.remove('show');
    this.updateModal.nativeElement.style.display = 'none';

    const backdrop = document.getElementById("backdrop");
    if (backdrop) { backdrop.style.display = "none" };
    document.body.style.overflow = 'auto';
    
  }

  updateSizeUnit() {
    if (this.updateSizeForm.valid) {
      let id = this.updateModal.nativeElement.id;
      let sizeId = id.substring(id.indexOf('-') + 1);
      console.log(sizeId);

      const formValues = this.updateSizeForm.value;
      let updatedSize: SizeVM = {
        sizeID: 0,
        categoryID: formValues.uCategoryID,
        /*categoryID: parseInt(this.selectedValue), */
        length: formValues.usizeLength,
        width: formValues.usizeWidth,
        weight: formValues.usizeWeight,
        volume: formValues.usizeVolume,
        height: formValues.usizeHeight,
        categoryDescription: ''
        
      };

      this.dataService.EditSize(sizeId, updatedSize).subscribe(
        (result: any) => {
          console.log('Updated Sizes', result);
          this.getSizes();''
          this.formatInputFieldsUpdate();
        },
        (error) => {
          console.error('Error updating items:', error);
        }
      );

      this.closeUpdateModal();
    }
  }

  get sizeLength() { return this.addSizeForm.get('sizeLength'); }
  get sizeWidth() { return this.addSizeForm.get('sizeWidth'); }
  get sizeWeight() { return this.addSizeForm.get('sizeWeight'); }
  get sizeVolume() { return this.addSizeForm.get('sizeVolume'); }
  get sizeHeight() { return this.addSizeForm.get('sizeHeight'); }
  get categoryID() { return this.addSizeForm.get('categoryID'); }

  get usizeLength() { return this.updateSizeForm.get('usizeLength'); }
  get usizeWidth() { return this.updateSizeForm.get('usizeWidth'); }
  get usizeWeight() { return this.updateSizeForm.get('usizeWeight'); }
  get usizeVolume() { return this.updateSizeForm.get('usizeVolume'); }
  get usizeHeight() { return this.updateSizeForm.get('usizeHeight'); }
  get ucategoryID() { return this.updateSizeForm.get('ucategoryID'); }

  formatSizes(): void {
    //This function makes an array out of the Size object and iterates through its attributes and formats the valid attributes such that if the value=0, it will be given the string value 'NA' and if the number is greater than 0 it will show in the front end prefaced with a x e.g 5x5
    this.filteredSizeUnits = [];
  
    this.sizeUnits.forEach(currentSize => {
      const category = this.categories.find(cat => cat.categoryID === currentSize.categoryID);
      let sizeString: string = '';
  
      if (category) {
        let sizes = Object.entries(currentSize).filter(([key, value]) => {
          return typeof value === 'number' && value > 0 && key !== 'categoryID' && key !== 'sizeID';
        });
  
        sizeString = sizes.map(([key, value]) => value).join('x');
  
        if (sizeString.trim() === '') {
          sizeString = 'N/A';
        }
  
        let tableSizeVM: TableSizeVM = {
          sizeString: sizeString,
          categoryID: category.categoryID,
          categoryDescription: currentSize.categoryDescription,
          sizeID: currentSize.sizeID
        };
  
        this.filteredSizeUnits.push(tableSizeVM);
      }
    });
  
    this.sizeCount = this.filteredSizeUnits.length;
    this.sizeholder=this.filteredSizeUnits;
    this.sizeholder = [...this.filteredSizeUnits]; 

  }

  formatInputFieldsAdd(): void {
    /*This method formats the AddSize form such that for a given category ID, the object returned for that category is checked for its values
    of :width, length, height, volume, weight, if the value is set to true, we enable the input field, if set to false, we disable the field
    */
    const selectedCategoryId = this.addSizeForm.controls['categoryID']?.value;
    const selectedCategory = this.categories.find(cat => cat.categoryID == selectedCategoryId);
  
    if (selectedCategory) {
      const { width, length, height, volume, weight } = selectedCategory;
  
      this.addSizeForm.get('sizeWidth')?.setValidators([Validators.required, this.allowZero()]);
      this.addSizeForm.get('sizeLength')?.setValidators([Validators.required, this.allowZero()]);
      this.addSizeForm.get('sizeHeight')?.setValidators([Validators.required, this.allowZero()]);
      this.addSizeForm.get('sizeVolume')?.setValidators([Validators.required, this.allowZero()]);
      this.addSizeForm.get('sizeWeight')?.setValidators([Validators.required, this.allowZero()]);
  
      if (width) {
        this.addSizeForm.get('sizeWidth')?.enable();
      } else {
        this.addSizeForm.get('sizeWidth')?.disable();
        this.addSizeForm.get('sizeWidth')?.setValue('0'); // Set as string
      }
  
      if (length) {
        this.addSizeForm.get('sizeLength')?.enable();
      } else {
        this.addSizeForm.get('sizeLength')?.disable();
        this.addSizeForm.get('sizeLength')?.setValue('0'); // Set as string
      }
  
      if (height) {
        this.addSizeForm.get('sizeHeight')?.enable();
      } else {
        this.addSizeForm.get('sizeHeight')?.disable();
        this.addSizeForm.get('sizeHeight')?.setValue('0'); // Set as string
      }
  
      if (volume) {
        this.addSizeForm.get('sizeVolume')?.enable();
      } else {
        this.addSizeForm.get('sizeVolume')?.disable();
        this.addSizeForm.get('sizeVolume')?.setValue('0'); // Set as string
      }
  
      if (weight) {
        this.addSizeForm.get('sizeWeight')?.enable();
      } else {
        this.addSizeForm.get('sizeWeight')?.disable();
        this.addSizeForm.get('sizeWeight')?.setValue('0'); // Set as string
      }
  
      // Update the validation state of the form controls
      this.addSizeForm.get('sizeWidth')?.updateValueAndValidity();
      this.addSizeForm.get('sizeLength')?.updateValueAndValidity();
      this.addSizeForm.get('sizeHeight')?.updateValueAndValidity();
      this.addSizeForm.get('sizeVolume')?.updateValueAndValidity();
      this.addSizeForm.get('sizeWeight')?.updateValueAndValidity();
    } else {
      this.addSizeForm.get('sizeWidth')?.disable();
      this.addSizeForm.get('sizeLength')?.disable();
      this.addSizeForm.get('sizeHeight')?.disable();
      this.addSizeForm.get('sizeVolume')?.disable();
      this.addSizeForm.get('sizeWeight')?.disable();
    }
  }

  formatInputFieldsUpdate(): void {
    const selectedCategoryId = this.updateSizeForm.controls['uCategoryID']?.value;
    const selectedCategory = this.categories.find(cat => cat.categoryID == selectedCategoryId);
  
    if (selectedCategory) {
      const { width, length, height, volume, weight } = selectedCategory;
  
      if (width) {
        this.updateSizeForm.get('usizeWidth')?.enable();
      } else {
        this.updateSizeForm.get('usizeWidth')?.disable();
        this.updateSizeForm.get('usizeWidth')?.setValue('0'); // Set as string
      }
  
      if (length) {
        this.updateSizeForm.get('usizeLength')?.enable();
      } else {
        this.updateSizeForm.get('usizeLength')?.disable();
        this.updateSizeForm.get('usizeLength')?.setValue('0'); // Set as string
      }
  
      if (height) {
        this.updateSizeForm.get('usizeHeight')?.enable();
      } else {
        this.updateSizeForm.get('usizeHeight')?.disable();
        this.updateSizeForm.get('usizeHeight')?.setValue('0'); // Set as string
      }
  
      if (volume) {
        this.updateSizeForm.get('usizeVolume')?.enable();
      } else {
        this.updateSizeForm.get('usizeVolume')?.disable();
        this.updateSizeForm.get('usizeVolume')?.setValue('0'); // Set as string
      }
  
      if (weight) {
        this.updateSizeForm.get('usizeWeight')?.enable();
      } else {
        this.updateSizeForm.get('usizeWeight')?.disable();
        this.updateSizeForm.get('usizeWeight')?.setValue('0'); // Set as string
      }
  
      // Set the current values for non-editable fields such that even if you change the category, the value remains the initial value the user had input but if the field is disabled, the user's value immediately is treated as a zero
      const sizeId = this.updateModal.nativeElement.id.substring(this.updateModal.nativeElement.id.indexOf('-') + 1);
      const currentSize = this.sizeUnits.find(size => size.sizeID == sizeId);
      if (currentSize) {
        const { length, width, height, weight, volume } = currentSize;
        if (!width) {
          this.updateSizeForm.get('usizeWidth')?.setValue('0');
        } else {
          this.updateSizeForm.get('usizeWidth')?.setValue(width);
        }
  
        if (!length) {
          this.updateSizeForm.get('usizeLength')?.setValue('0');
        } else {
          this.updateSizeForm.get('usizeLength')?.setValue(length);
        }
  
        if (!height) {
          this.updateSizeForm.get('usizeHeight')?.setValue('0');
        } else {
          this.updateSizeForm.get('usizeHeight')?.setValue(height);
        }
  
        if (!volume) {
          this.updateSizeForm.get('usizeVolume')?.setValue('0');
        } else {
          this.updateSizeForm.get('usizeVolume')?.setValue(volume);
        }
  
        if (!weight) {
          this.updateSizeForm.get('usizeWeight')?.setValue('0');
        } else {
          this.updateSizeForm.get('usizeWeight')?.setValue(weight);
        }
      }
  
      // Update the validation state of the form controls
      this.updateSizeForm.get('usizeWidth')?.updateValueAndValidity();
      this.updateSizeForm.get('usizeLength')?.updateValueAndValidity();
      this.updateSizeForm.get('usizeHeight')?.updateValueAndValidity();
      this.updateSizeForm.get('usizeVolume')?.updateValueAndValidity();
      this.updateSizeForm.get('usizeWeight')?.updateValueAndValidity();
    } else {
      this.updateSizeForm.get('usizeWidth')?.disable();
      this.updateSizeForm.get('usizeLength')?.disable();
      this.updateSizeForm.get('usizeHeight')?.disable();
      this.updateSizeForm.get('usizeVolume')?.disable();
      this.updateSizeForm.get('usizeWeight')?.disable();
    }
  }
  
  
  }
  
  
  
  
