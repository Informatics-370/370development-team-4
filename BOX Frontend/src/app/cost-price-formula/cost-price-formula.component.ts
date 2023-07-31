import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CostPriceFormulaVariables } from '../shared/cost-price-formula-variables';
declare var $: any;

@Component({
  selector: 'app-cost-price-formula',
  templateUrl: './cost-price-formula.component.html',
  styleUrls: ['./cost-price-formula.component.css']
})
export class CostPriceFormulaComponent {
  formulaVariables: CostPriceFormulaVariables[] = []; //used to store all formula variables
  //forms
  updateFormulaVariablesForm: FormGroup;
  loadingError = false;
  submitClicked = false; //keep track of when submit button is clicked in form, for validation errors
  loading = true; //show loading message while data loads
  selectedFormulaVariables! : CostPriceFormulaVariables;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.updateFormulaVariablesForm = this.formBuilder.group({
      box_Factor: [1, Validators.required],
      rate_Per_Ton: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getFormulaVariables();
  }

  getFormulaVariables() { //get all formula variables
    try {
      this.dataService.GetAllFormulaVariables().subscribe((result: any[]) => {
        let allVariables: any[] = result;
        this.formulaVariables = []; //empty array
        allVariables.forEach((currentFormulaVariable) => {
          this.formulaVariables.push(currentFormulaVariable);
        });
  
        //sort formula variables so single wall box is always first and double wall box is second
        this.formulaVariables.sort((currentFormulaVariable, nextFormulaVariable) => {
          if (currentFormulaVariable.description.toLocaleLowerCase() > nextFormulaVariable.description.toLocaleLowerCase()) { return -1; }
          if (currentFormulaVariable.description.toLocaleLowerCase() < nextFormulaVariable.description.toLocaleLowerCase()) { return 1; }
          return 0;
        });
  
        console.log('All formula variables array: ', this.formulaVariables);
        this.loading = false; //stop displaying loading message
      });
    } 
    catch (error) {
      this.loading = false;
      this.loadingError = true;
      console.error(error);
    }
  }

  openUpdateModal(id: number) {
    this.selectedFormulaVariables = this.formulaVariables[id];
    
    //display data in form
    this.updateFormulaVariablesForm.setValue({
      box_Factor: this.selectedFormulaVariables.box_Factor,
      rate_Per_Ton: this.selectedFormulaVariables.rate_Per_Ton
    });

    $('#updateFormulaVariables').modal('show');
  }

  updateCostPriceFormulaVariables() {
    this.submitClicked = true;
    if (this.updateFormulaVariablesForm.valid) {

      //get form data
      const formValues = this.updateFormulaVariablesForm.value;
      let updatedCPFV: CostPriceFormulaVariables = {        
        formulaID: 0,
        description: 'dummy description',
        box_Factor: formValues.box_Factor,
        rate_Per_Ton: formValues.rate_Per_Ton,
        factory_Cost: 0,
        mark_Up: 0
      };

      try {
        this.dataService.UpdateFormulaVariables(this.selectedFormulaVariables.formulaID, updatedCPFV).subscribe((result: any) => {
          this.getFormulaVariables();
          console.log('Updated Formula Variables', result);
          this.submitClicked = false; //reset submission status
          $('#updateFormulaVariables').modal('hide');
        });
      }
      catch (error) {
        console.error('Error updating: ' + error);
      }
      
    }
  }

  get boxFactor() { return this.updateFormulaVariablesForm.get('box_Factor'); }
  get ratePerTon() { return this.updateFormulaVariablesForm.get('rate_Per_Ton'); }
}
