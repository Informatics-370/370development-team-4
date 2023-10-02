import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderVM } from '../../shared/order-vm';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.css']
})
export class ReviewOrderComponent {

  //forms logic
  reviewOrder: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.reviewOrder = this.formBuilder.group({
      productRating: [5, Validators.required],
      reviewComments: ['', Validators.required],
      recommendation: ['true', Validators.required]
    });
  }

  openReviewModal() {
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
  }

}
