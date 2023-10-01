import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { take, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderVM } from '../shared/order-vm';
import { Users } from '../shared/user';
import { OrderVMClass } from '../shared/order-vm-class';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deliver-order',
  templateUrl: './deliver-order.component.html',
  styleUrls: ['./deliver-order.component.css']
})
export class DeliverOrderComponent {
  code: string = '';
  order!: OrderVMClass;

  //messages to user
  loading = true;
  error = false;
  submitted = false;

  //forms logic
  deliveryForm: FormGroup;

  //user data
  driver!: Users;

  constructor(private dataService: DataService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, 
    private authService: AuthService, private emailService: EmailService) {
    this.deliveryForm = this.formBuilder.group({
      deliveryType: ['Delivery', Validators.required],
      paymentType: ['Pay immediately', Validators.required],
      amount: [Validators.required],
      deliveryPhoto: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getDriverData();
    
    //Retrieve the code that leads to this order from url
    this.activatedRoute.paramMap.subscribe(params => {
      //get parameters from url
      let codeFromURL = params.get('code');
      if (codeFromURL) this.code = codeFromURL;
      console.log(this.code);

      
    });
  }

  async getDriverData() {
    const token = localStorage.getItem('access_token')!;
    let email = this.authService.getEmailFromToken(token);
    if (email) {
      this.driver = await this.authService.getUserByEmail(email);
      let id = await this.authService.getUserIdFromToken(token);
      if (id) this.driver.id = id;

      console.log(this.driver)
    }
  }

}
