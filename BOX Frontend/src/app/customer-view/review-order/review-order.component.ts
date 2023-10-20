import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { OrderVM } from '../../shared/order-vm';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.css']
})
export class ReviewOrderComponent {
  order!: OrderVM;
  code!: string;
  review: any;
  alreadyReviewed = false;

  //forms logic
  reviewOrderForm: FormGroup;
  rating = 0;
  submitClicked = false; //submit button was clicked
  processing = false; //data is being processed

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, 
    private router: Router) {
    this.reviewOrderForm = this.formBuilder.group({
      comments: ['', Validators.required],
      recommendation: ['true', Validators.required]
    });
  }

  ngOnInit() {    
    //Retrieve the code that leads to this order from url
    this.activatedRoute.paramMap.subscribe(params => {
      //get parameters from url
      let codeFromURL = params.get('code');
      if (codeFromURL) {
        this.code = codeFromURL;
        this.getOrder(this.code);
      }      
    });
  }

  getOrder(code: string) {
    this.dataService.GetOrderByCode(code).subscribe({
      next: (result) => {
        this.order = result;
        this.checkIfReviewed(this.order);
        console.log('Order to review:', this.order);
      },
      error: (error) => {
        console.error(error);
        this.preventReview('Oops..', 'Error retrieving order from the database. Please check that your link is not broken.');
      }
    });
  }

  preventReview(title: string, html: string) {
    //error message
    Swal.fire({
      icon: 'error',
      title: title,
      html: html,
      timer: 8000,
      timerProgressBar: true,
      confirmButtonColor: '#32AF99'
    }).then((result) => {
      this.router.navigate(['order-history']);
    });
  }

  checkIfReviewed(order: OrderVM) {
    if (order.reviewID > 0) {
      try {
        this.dataService.GetReview(order.reviewID).subscribe((result) => {
          this.review = result;
          this.alreadyReviewed = true;

          //disable controls
          this.comments?.disable();
          this.recommendation?.disable();

          //set control values
          this.rating = this.review.product_Rating;
          this.reviewOrderForm.patchValue({
            recommendation: this.review.recommendation ? 'true' : 'false',
            comments: this.review.comments
          });

          console.log('reviewed', this.review);
        });
      } catch (error) {
        this.preventReview('Oh no', 'Something went wrong and we could not retrieve this review from the database. Don\'t worry, you\'ve already reviewed this order.')
        console.error(error);
      }
    }
  }

  rate(stars: number) {
    if (stars > 0 && stars < 6) this.rating = stars;
  }

  reviewOrder() {
    this.submitClicked = true;
    if (this.reviewOrderForm.valid) {
      this.processing = true;

      try {
        //get review data
        let review = {
          orderID: this.order.customerOrderID,
          product_Rating: this.rating,
          comments: this.comments?.value,
          recommendation: this.recommendation?.value == 'true' ? true : false
        }

        console.log('review to submit', review);
        this.dataService.ReviewOrder(review).subscribe((result) => {
          console.log(result);
          this.processing = false;
          this.submitClicked = false;
          Swal.fire({
            icon: 'success',
            title: "Review submitted",
            html: "Thank you for your review!",
            timer: 3000,
            timerProgressBar: true,
            confirmButtonColor: '#32AF99'
          }).then((response) => {
            this.router.navigate(['customer-homepage']);
          });
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: "Oops..",
          html: "Something went wrong when submitting your review. Please try again later.",
          timer: 3000,
          timerProgressBar: true,
          confirmButtonColor: '#32AF99'
        }).then((result) => {
        });
      }
    }
  }

  get recommendation() { return this.reviewOrderForm.get('recommendation'); }
  get comments() { return this.reviewOrderForm.get('comments'); }
}
