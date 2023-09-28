import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RawMaterialVM } from '../shared/rawMaterialVM';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { Supplier } from '../shared/supplier';
import { take, lastValueFrom } from 'rxjs';
import { SupplierOrderVM } from '../shared/supplierOrder-vm';
import { SupplierOrderLineVM } from '../shared/supplierOrderline-vm';
import { SupplierVM } from '../shared/supplier-vm';
declare var $: any;

@Component({
  selector: 'app-supplier-order',
  templateUrl: './supplier-order.component.html',
  styleUrls: ['./supplier-order.component.css']
})
export class SupplierOrderComponent {
  // public selectedValue = 'NA';
  suppliers: Supplier[] = [];
  // filteredSuppliers: SupplierVM []=[];
  rawMaterials: RawMaterialVM[] = [];
  //filteredRawMaterials: RawMaterialVM[] =[];
  fixedProducts: FixedProductVM[] = [];
  //filteredFixedProducts: FixedProductVM[] = [];
  supplierOrders: SupplierOrderVM[] = [];
  filteredsupplierorders: SupplierOrderVM[] = [];
  //orderForm: FormGroup = new FormGroup({});
  // selectedProductItemID: number | null = null;
  capturedsupplierorder: SupplierOrderVM ={
    supplierOrderID : 0,
    supplierID: 0,
    date: '17/08/2023',
    supplierName: '',
    supplierOrders: []

  };
  test!: SupplierOrderLineVM;
  viewsupplierorder!: SupplierOrderVM;
  supplierorderCount: number = -1;
 
  todayString: string = new Date().toDateString();
  //forms
  captureSupplierOrderForm: FormGroup;

  //select element values
  public selectedSupplierID = 'NA';
  public selectedRawMaterialID = 'NA';
  public selectedFixedProductID = 'NA';

  //search functionality 
  searchTerm: string = '';
  //error, loading, messages
  loading = true;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.captureSupplierOrderForm = this.formBuilder.group({
      supplierID: ['NA', Validators.required],
      fixedproductID: ['NA', Validators.required],
      rawmaterialID: ['NA', Validators.required],
      quantity: [1.00, Validators.required]
    });
  }

  ngOnInit(): void {
      this.getDataFromDB();
  }

  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getSuppliers = lastValueFrom(this.dataService.GetAllSuppliers().pipe(take(1)));
      const getFixedProducts = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
      const getRawMaterial = lastValueFrom(this.dataService.GetAllRawMaterials().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing. However, the console logs are executing in order, which raises questions.
      But that could just be because they're outside the Promise.all. IDC!!!!! I'm tired of trying to find alternatives for this. 
      And data is being retrieved faster that how I had it work before so I'm moving on with my life
      get all products, categories, items and sizes and put in categories, items, sizes and products array*/
      const [supplier, fixedproduct, rawmaterial] = await Promise.all([
        getSuppliers,
        getFixedProducts,
        getRawMaterial
      ]);

      //put results from DB in global arrays
      this.suppliers = supplier;
      console.log('All suppliers:', this.suppliers);
      this.fixedProducts = fixedproduct;
      console.log('All fixed products:', this.fixedProducts);
      this.rawMaterials = rawmaterial;
      console.log('All raw materials:', this.rawMaterials);

      await this.getSupplierOrdersPromise(); //get products; I love the await keyword
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  //get products separately so I can update only products list, and not categories, items, etc. when product is CRUDed to save time
  async getSupplierOrdersPromise(): Promise<any> {
    try {
      this.supplierOrders = await lastValueFrom(this.dataService.GetAllSupplierOrders().pipe(take(1)));
      if (!(this.supplierOrders.length > 0))
       { this.supplierorderCount = 0;
      this.supplierOrders = [] ;}
      this.loading = false;


      //this.formatProducts(); //Execute only after data has been retrieved from the DB otherwise error; put products in format to display in table

      return 'Successfully retrieved orders from the database';
    } catch (error) {
      console.log('An error occurred while retrieving orders: ' + error);
      throw new Error('An error occurred while retrieving orders: ' + error);
    }
  }
  /* 
    getAllSuppliers() {
      this.dataService.GetAllSuppliers().subscribe((result: any[]) => {
        this.suppliers = result.map((supplier: Supplier) => {
          return {
            contact_Number: supplier.contact_Number,
            supplierID: supplier.supplierID,
            name: supplier.name,
            address:supplier.address,
            email:supplier.email
          };
        });
      });
    }
  
    getAllRawMaterials() {
      this.dataService.GetAllRawMaterials().subscribe((result: any[]) => {
        this.rawMaterials = result.map((raw: RawMaterialVM) => {
          return {
            rawMaterialID: raw.rawMaterialID,
            description: raw.description,
            qrCodeID: raw.qrCodeID,
            qrCodeBytesB64: raw.qrCodeBytesB64,
            quantityOnHand: raw.quantityOnHand
          };
        });
      });
    }
  
    getAllFixedProducts() {
      this.dataService.GetAllFixedProducts().subscribe((result: any[]) => {
        this.fixedProducts = result.map((fixed: FixedProductVM) => {
          return {
            fixedProductID: fixed.fixedProductID,
            qrCodeID: fixed.qrCodeID,
            qrCodeBytesB64: fixed.qrCodeBytesB64,
            itemID: fixed.itemID,
            sizeID: fixed.sizeID,
            description: fixed.description,
            price: fixed.price,
            productPhotoB64: fixed.productPhotoB64,
            quantityOnHand: fixed.quantityOnHand
          };
        });
      });
    } */

  /* onProductTypeChange() {
    this.rawMaterials = [];
    this.fixedProducts = [];

    if (this.orderForm.value.prodType === 'Raw Material') {
      this.getAllRawMaterials();
    } else if (this.orderForm.value.prodType === 'Fixed Product') {
      this.getAllFixedProducts();
    }
  } */

  //function that adds supplier orders to table in capture supplier order modal
  addSupplierOrderLine() {
    if (this.captureSupplierOrderForm.valid && this.selectedSupplierID != 'NA' && (this.selectedFixedProductID != 'NA' || this.selectedRawMaterialID != 'NA')) {
      //REMOVED FIXED PRODUCT FROM DROPDOWN
      /* let toDelete = this.selectedFixedProductID.find(prod => this.selectedFixedProductID?.fixedProductID == prod.fixedProductID); //find fixed product with matching ID
      if (toDelete) this.filteredFixedProducts.splice(this.filteredFixedProducts.indexOf(toDelete), 1); //if product is found, delete it
 */

      const formData = this.captureSupplierOrderForm.value; //get form data

      var selectedFixedProduct: FixedProductVM | undefined = undefined;

      var selectedRawMaterial: RawMaterialVM | undefined = undefined;
  
  
  
      if (this.selectedFixedProductID != 'NA')  
        selectedFixedProduct = this.fixedProducts.find(prod => prod.fixedProductID == parseInt(this.selectedFixedProductID));
  
      else  
        selectedRawMaterial = this.rawMaterials.find(mat => mat.rawMaterialID == parseInt(this.selectedRawMaterialID));
      
      let newsupplierorderline: SupplierOrderLineVM = {
        fixedProductID: selectedFixedProduct ? selectedFixedProduct.fixedProductID : 0 ,
        rawMaterialID: selectedRawMaterial ? selectedRawMaterial.rawMaterialID : 0,
        quantity: formData.quantity,
        supplierOrderLineID: 0,
        fixedProductDescription: selectedFixedProduct ? selectedFixedProduct.description : '',
        rawMaterialDescription: selectedRawMaterial ? selectedRawMaterial.description : '',
        supplierReturnID: 0
      };

      console.log('supplier order line', newsupplierorderline);

      this.capturedsupplierorder.supplierOrders.push(newsupplierorderline);
      console.log('supplier orders after adding', this.supplierOrders);



      //reset form
      this.selectedSupplierID = this.capturedsupplierorder.supplierID.toString(); //reset supplier dropdown
      this.selectedFixedProductID = 'NA'; //reset product dropdown
      this.selectedRawMaterialID = 'NA'; //reset raw mat dropdown
      this.captureSupplierOrderForm.get('quantity')?.setValue(1);
    }

  }

  saveorder(){
    console.log('supplier order lines ', this.capturedsupplierorder);
    this.dataService.AddSupplierOrder(this.capturedsupplierorder).subscribe(
      (result: any) => {
        console.log('Successfully captured order! ', result);
        $('#capturesupplierorder').modal('hide');
        this.getSupplierOrdersPromise(); //refresh  list
        
      }
    );
  }

  changedSupplier(){
    this.capturedsupplierorder.supplierID = parseInt(this.selectedSupplierID);
  }


  //search function
  searchSupplierOrders(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredsupplierorders = []; //clear array
    for (let i = 0; i < this.supplierOrders.length; i++) {
      let currentsupplierordersearch: string = String(this.supplierOrders[i].supplierOrderID + ' ' +
        this.supplierOrders[i].supplierName + ' ' +
        this.supplierOrders[i].date + ' ');
      if (currentsupplierordersearch.includes(this.searchTerm.toLowerCase())) {
        this.filteredsupplierorders.push(this.supplierOrders[i]);
      }
    }
    this.supplierorderCount = this.filteredsupplierorders.length; //update raw material count so message can be displayed if no reasons are found
    console.log(this.filteredsupplierorders);
  }


  //view specific supplier order modal

openViewSupplierOrder (order: SupplierOrderVM) {
  this.viewsupplierorder = order;  //this.supplierOrders[order.supplierOrderID];
 // try {

    // this.dataService.GetSupplierOrder(this.viewsupplierorder.supplierOrderID).subscribe((result: any) => {

    //   //this.GetSupplierOrders();

    //   console.log('Supplier Orders', result);

    //   //this.submitClicked = false; //reset submission status

      $('#viewsupplierorder').modal('show');
      
      console.log(this.test.rawMaterialDescription)

    //});

  // }

  // catch (error) {

  //   console.error('Error updating: ' + error);

  // }    

  // $('#viewSupplierOrder').modal('show');

}



displayStyle = "none";
openPopup() {
  this.displayStyle = "block";
}
closePopup() {
  this.displayStyle = "none";
  this.viewsupplierorder;
}
  /*  onProductItemChange() {
     this.selectedProductItemID = this.orderForm.value.prodItemID;
   } */


  // createSupplierOrder() {
  // 	//create estimate
  // 	let newSupplierOrder : SupplierOrderVM = {

  //     supplierOrderID:0,
  //     supplierID:0,
  //     Date:'',
  //     SupplierOrders : []

  // 	}

  // 	//create estimate lines from cart
  // 	this.supplierOrders.forEach(Orders => {			
  // 		let supplierOrderline : SupplierOrderLineVM = {
  //       supplierOrderLineID:0,
  //       supplierOrderID:0,
  //       fixedProductID:0,
  //       rawMaterialID:0,
  //       supplierReturnID:0,
  //       fixedProductDescription:'',
  //       rawMaterialDescription:'',
  //       quantity:0

  // 		}

  // 		newSupplierOrder.SupplierOrders.push(supplierOrderline);
  // 	});

  // 	console.log('Supplier Order before posting: ', newSupplierOrder);

  // 	try {
  // 		//post to backend
  // 		this.dataService.AddSupplierOrder(newSupplierOrder).subscribe((result) => {
  // 			console.log('New Supplier Order: ', result)
  // 		});
  // 	} catch (error) {
  // 		console.error('Error submitting Supplier Order: ', error);
  // 	}
  // }
  

}
