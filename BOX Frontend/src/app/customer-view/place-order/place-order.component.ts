import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Item } from '../../shared/item';
import { Cart } from '../../shared/customer-interfaces/cart';
import { Discount } from '../../shared/discount';

import { CartService } from '../../services/customer-services/cart.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent {
  /*Statuses:
  1 Placed
  2 In progress
  3 Cancelled
  4 Ready for delivery
  5 Out for delivery
  6 Completed
  */
}
