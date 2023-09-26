import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-supplier-order',
  templateUrl: './supplier-order.page.html',
  styleUrls: ['./supplier-order.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SupplierOrderPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
