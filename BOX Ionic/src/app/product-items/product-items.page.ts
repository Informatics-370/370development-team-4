import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-product-items',
  templateUrl: './product-items.page.html',
  styleUrls: ['./product-items.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductItemsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
