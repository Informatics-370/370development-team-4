import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-fixed-products',
  templateUrl: './fixed-products.page.html',
  styleUrls: ['./fixed-products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FixedProductsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
