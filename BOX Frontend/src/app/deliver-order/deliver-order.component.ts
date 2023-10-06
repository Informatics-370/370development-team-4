import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { DataService } from '../services/data.services';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { take, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { OrderVM } from '../shared/order-vm';
import { Users } from '../shared/user';
import { OrderVMClass } from '../shared/order-vm-class';
import { VAT } from '../shared/vat';
import { CurrencyPipe } from '@angular/common';
import { Html5Qrcode, QrcodeSuccessCallback } from "html5-qrcode";
import { Html5QrcodeScanner } from "html5-qrcode";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deliver-order',
  templateUrl: './deliver-order.component.html',
  styleUrls: ['./deliver-order.component.css'],
  providers: [CurrencyPipe]
})
export class DeliverOrderComponent implements AfterViewInit {
  code: string = '';
  order!: OrderVMClass;

  //messages to user
  isScanning = false;
  finishedScan = false;
  error = false;
  submitted = false;
  promptManual = false;

  //forms logic
  deliveryForm: FormGroup;
  cashOnDelivery = false;
  noFileSelected = true;
  invalidFile = false;

  //user data
  driver!: Users;

  currentVAT!: VAT;

  constructor(private dataService: DataService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, 
    private authService: AuthService, private emailService: EmailService, private currencyPipe: CurrencyPipe,
    private router: Router, private renderer2: Renderer2) {
    this.deliveryForm = this.formBuilder.group({
      code: ['', Validators.required],
      deliveryType: ['', Validators.required],
      paymentType: ['', Validators.required],
      amount: ['', Validators.required],
      deliveryPhoto: ['', Validators.required],
    });

    //disable all form fields except deliveryPhoto
    this.deliveryForm.get('deliveryType')?.disable();
    this.deliveryForm.get('paymentType')?.disable();
    this.deliveryForm.get('amount')?.disable();
  }

  ngAfterViewInit() {    
    //Retrieve the code that leads to this order from url
    this.activatedRoute.paramMap.subscribe(params => {
      //get parameters from url
      let codeFromURL = params.get('code');
      if (codeFromURL) {
        this.code = codeFromURL;
        this.getDataFromDB(this.code);
      }
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

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB(alphanumericcode: string) {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetVAT().pipe(take(1)));
      const getOrderPromise = lastValueFrom(this.dataService.GetOrderByCode(alphanumericcode).pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling next method
      That's what the Promise.all method is supposed to be doing.*/
      const [currentVAT, order] = await Promise.all([
        getVATPromise,
        getOrderPromise
      ]);

      //put results from DB in global attributes
      this.currentVAT = currentVAT;

      await this.getDriverData();

      //put order in class
      this.order = new OrderVMClass(order, order.orderLines, this.currentVAT);
      this.preventDuplicates();

      //set field values
      if (this.order.paymentTypeID == 2) this.cashOnDelivery = true;
      this.deliveryForm.patchValue({
        paymentType: this.order.paymentType,
        deliveryType: this.order.deliveryType,
        amount: this.cashOnDelivery ? this.currencyPipe.transform((this.order.totalBeforeVAT * 0.8) + this.order.totalVAT, 'ZAR', 'R') : 0
      });

      console.log('order', this.order);

    } catch (error) {
      this.error = true;
      console.error('An error occurred:', error);
    }
  }

  //prevent order from being delivered twice
  preventDuplicates() {
    if (this.order.orderStatusID == 7) {
      Swal.fire({
        icon: 'error',
        title: "Oh no",
        html: "This order has already been delivered.",
        timer: 3000,
        timerProgressBar: true,
        confirmButtonColor: '#32AF99'
      }).then((result) => {
        this.router.navigate(['dashboard']);
      });
    }
  }

  //---------------------- SCAN QR CODE ----------------------
  async startScan() {
    if (!this.isScanning) {
      this.isScanning = true;
      this.finishedScan = false;
      let qrCodeScanned = false;
      const html5QrCode = new Html5Qrcode("scanner"); // Flag to indicate whether QR code is successfully scanned
      const config = { fps: 20, qrbox: { width: 350, height: 350 } };

      // Start timer when scanning starts
      const startTime = new Date().getTime();

      // Timer to check if 2 minutes have passed since scanning started and call promptCodeEntry if it has
      const timeoutTimer = setInterval(() => {
        const currentTime = new Date().getTime();
        if (qrCodeScanned || currentTime - startTime >= 10000) { // 2 minutes = 120000 milliseconds
          console.log('qrCodeScanned ' + qrCodeScanned + ' time passed in ms ' + (currentTime - startTime));
          clearInterval(timeoutTimer); // Clear the timer when QR code is scanned or 2 minutes have passed
          if (!qrCodeScanned) {
            // QR code not scanned within 2 minutes, call promptCodeEntry
            console.log('Bout to prompt code reentry. it\'s been too long');
            this.promptCodeEntry();
            html5QrCode.stop(); // Stop the QR code scanner
          }
        }
      }, 5000); // Check every 1 minute = 60000ms

      //what to do if scan is successful
      const onScanSuccess = (decodedText, decodedResult) => {
        console.log(`Code matched = ${decodedText}`, decodedResult);
        qrCodeScanned = true; // Set the flag to indicate QR code is scanned
        clearInterval(timeoutTimer); // Clear the timer when QR code is scanned

        //stop scanner
        html5QrCode.stop().then(() => {
          this.isScanning = false;
          this.finishedScan = true;

          //do something with scan result
        }).catch((err) => {
          // Handle stop error
        });
      };
    
      //what to do if scan fails
      const onScanFailure = (error) => { };
  
      try {
        // Attempt to get available cameras
        const devices = await Html5Qrcode.getCameras();
  
        if (devices && devices.length) {
          const cameraId = devices[0].id;
          // Start scanning using the selected camera
          html5QrCode.start({ deviceId: { exact: cameraId} }, config, onScanSuccess, onScanFailure);
        } else {
          // No cameras available, start scanning using front camera
          html5QrCode.start({ facingMode: "user" }, config, onScanSuccess, onScanFailure);
        }
  
      } catch (error) {
        console.error(error);
        // Error accessing cameras, start scanning using front camera
        if (error instanceof DOMException && error.message === "Could not start video source") {
          html5QrCode.start({ facingMode: "user" }, config, onScanSuccess, onScanFailure);
        }
        // error scanning; prompt code entry
        else {
          console.error('Can\'t scan', error);
          this.promptCodeEntry();
        }
      }
    }
  }

  //delay action by a number of milliseconds using promise
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  promptCodeEntry() {
    this.isScanning = false;
    console.log('We here man');
    // Scroll to the #codeEntryPrompt div
    document.getElementById("codeEntryPrompt")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });

    // Add the strongShake class to trigger the animation by setting variable
    this.promptManual = true;

    // Clear the strongShake class after the animation duration (0.3s)
    setTimeout(() => {
      this.promptManual = false;
    }, 300);

    const timeoutTimer = setInterval(() => {
      // Scroll to the #codeEntryPrompt div
      document.getElementById("codeEntryPrompt")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });

      // Add the strongShake class to trigger the animation by setting variable
      this.promptManual = true;

      // Clear the strongShake class after the animation duration (0.3s)
      setTimeout(() => {
        this.promptManual = false;
      }, 300);

    }, 5000); // Repeat every 1 minute
  }

  //------------------- DELIVER ORDER -------------------
  //function to display image name since I decided to be fancy with a custom input button
  showImageName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const chosenFile = inputElement.files?.[0];
    let imageName = document.getElementById('imageName') as HTMLSpanElement;
    //create button to remove an uploaded pic
    let removeBtn: HTMLButtonElement = document.createElement('button');
    removeBtn.classList.add('remove-pic');
    removeBtn.setAttribute('title', 'Remove file')
    removeBtn.innerHTML = 'Remove';
    removeBtn.addEventListener('click', this.removeFile.bind(this));

    if (chosenFile) { //if there is a file chosen
      //if chosen file is a pic
      if (chosenFile.type.includes('pdf') || chosenFile.type.includes('jpeg') || chosenFile.type.includes('jpg') || chosenFile.type.includes('png')) {
        imageName.innerHTML = chosenFile.name; //display file name
        imageName.style.display = 'inline-block';
        imageName.appendChild(removeBtn);
        this.noFileSelected = false;
        this.invalidFile = false;
      }
      else {
        imageName.style.display = 'none';
        this.invalidFile = true;
        this.noFileSelected = false;
      }
    }
    else {
      imageName.style.display = 'none';
      this.invalidFile = false;
      this.noFileSelected = true;
    }
  }

  //convert image to B64
  convertToBase64(img: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        resolve(base64String.substring(base64String.indexOf(',') + 1)); // Resolve the promise with the base64 string; get rid of the data:image/... that auto appends itself to the B64 string
      };
      reader.onerror = (error) => {
        reject(error); // Reject the promise if an error occurs
      };
      reader.readAsDataURL(img);
    });
  }

  removeFile() {
    //get file input and name span from reject quote form modal
    let fileName: HTMLSpanElement = document.getElementById('imageName') as HTMLSpanElement;
    let fileInput: HTMLInputElement = document.getElementById('deliveryPhoto') as HTMLInputElement;

    //remove file from file input
    fileInput.value = '';
    fileName.innerHTML = '';
    this.noFileSelected = true;
  }

  async deliverOrder() {
    if (!this.invalidFile && !this.noFileSelected) {
      this.submitted = true;
      //form data makes the image a string with a fake url which I can't convert to B64 so I must get the actual value of the file input      
      const inputElement = document.getElementById('deliveryPhoto') as HTMLInputElement;
      const formImage = inputElement.files?.[0];

      let deliveredOrder: OrderVM = {
        customerOrderID: this.order.customerOrderID,
        quoteID: this.order.quoteID,
        deliveryPhoto: formImage ? await this.convertToBase64(formImage) : '', //convert to B64 if there's an image selected, otherwise, empty string
        paymentID: this.order.paymentID,
        paymentTypeID: this.order.paymentTypeID,
        paymentType: '',
        deliveryDate: this.order.deliveryDate,
        customerId: this.order.customerId,
        customerFullName: '',
        orderStatusID: this.order.orderStatusID,
        orderStatusDescription: '',
        deliveryTypeID: this.order.deliveryTypeID,
        deliveryType: '',
        deliveryScheduleID: 0,
        date: new Date(Date.now()),
        code: this.code,
        qrcodeB64: '',
        reviewID: 0,
        orderLines: []
      }

      try {
        this.dataService.DeliverOrder(this.order.customerOrderID, deliveredOrder).subscribe((result) => {
          console.log('Successfully delivered: ', result);

          //send email
          //get customer email
          this.dataService.GetCustomerByUserId(this.order.customerId).subscribe((result) => {
            let customerEmail = result.email;

            let emailBody = `<p>Thank you for ordering with MegaPack. Your order was delivered / collected and completed. Would 
                            you mind completing a
                            <a style='font-weight: 600; text-decoration: underline; cursor: pointer; color: black;' href='http://localhost:4200/review-order/${this.code}'>quick review</a>?</p>`;

            this.emailService.sendEmail(customerEmail, 'Your package has arrived', this.order.customerFullName, emailBody);

            this.submitted = false;
            
            Swal.fire({
              icon: 'success',
              title: "Success",
              html: "The order is now marked as completed and the customer has been notified via email.",
              timer: 3000,
              timerProgressBar: true,
              confirmButtonColor: '#32AF99'
            }).then((result) => {
              this.router.navigate(['dashboard']);
            });
          });

        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: "Oops..",
          html: "Something went wrong and the order could not be completed.",
          timer: 3000,
          timerProgressBar: true,
          confirmButtonColor: '#32AF99'
        }).then((result) => {
        });
        console.error('Error delivering order: ', error);
      }
    }
  }

  get codeInput() { return this.deliveryForm.get('code'); }

}