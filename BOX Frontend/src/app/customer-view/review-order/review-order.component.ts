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
    this.dataService.GetOrderByCode(code).subscribe((result) => {
      this.order = result;

      console.log('Order to review:', this.order);
    });
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

  /* openReviewModal() {
    Swal.fire({
      title: 'Write a Review',
      html:
        '<input id="productRating" type="number" class="swal2-input" placeholder="Product Rating (1-5)" min="1" max="5">' +
        '<input id="reviewComments" class="swal2-input" placeholder="Comments">' +
        '<select id="recommendation" class="swal2-input">' +
        '  <option value="true">Recommend</option>' +
        '  <option value="false">Do Not Recommend</option>' +
        '</select>',
      focusConfirm: false,
      preConfirm: () => {
        const productRatingInput = Swal.getPopup()!.querySelector('#productRating') as HTMLInputElement;
        const reviewCommentsInput = Swal.getPopup()!.querySelector('#reviewComments') as HTMLInputElement;
        const recommendationSelect = Swal.getPopup()!.querySelector('#recommendation') as HTMLSelectElement;

        const product_Rating = productRatingInput?.value;
        const comments = reviewCommentsInput?.value;
        const recommendation = recommendationSelect?.value === 'true';

        return { product_Rating, comments, recommendation };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result)
        this.addReview(result.value);
      }
    });
  }
  
  addReview(reviewData: any) {
    const apiUrl = 'http://localhost:5116/api/Review/AddCustomerReview'; // Replace with your actual API endpoint
    this.http.post(apiUrl, reviewData).subscribe(
      (response) => {
        // Handle successful review submission
        Swal.fire('Review Submitted', 'Thank you for your review!', 'success');
      },
      (error) => {
        // Handle error
        Swal.fire('Error', 'An error occurred while submitting your review.', 'error');
      }
    );
  } */

  get recommendation() { return this.reviewOrderForm.get('recommendation'); }
  get comments() { return this.reviewOrderForm.get('comments'); }
}