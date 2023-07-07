import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.services';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  constructor(private dataService: DataService) {}

  ngOnInit() {

  }

}
