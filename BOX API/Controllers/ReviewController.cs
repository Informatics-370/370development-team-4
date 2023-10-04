using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IRepository _repository; // Replace IRepository with your actual repository interface/type

        public ReviewController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("GetReview/{reviewId}")] //READ SPECIFIC CATEGORY AND ASSOCIATED SIZE VARIABLES
        public async Task<IActionResult> GetReview(int reviewId)
        {
            try
            {
                var review = await _repository.GetReviewAsync(reviewId);
                if (review == null) return NotFound("The review does not exist on the system");

                CustomerReviewViewModel reviewVM = new CustomerReviewViewModel()
                {
                    Product_Rating = review.Product_Rating,
                    Comments = review.Comments,
                    Recommendation = review.Recommendation
                };

                return Ok(reviewVM);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpPost]
        [Route("AddCustomerReview")]
        public async Task<IActionResult> AddCustomerReview(CustomerReviewViewModel crVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var customerReview = new Customer_Review
            {
                Product_Rating = crVM.Product_Rating,
                Comments = crVM.Comments,
                Recommendation = crVM.Recommendation
            };

            try
            {
                _repository.Add(customerReview);
                await _repository.SaveChangesAsync(); //this generates ID for review

                var existingOrder = await _repository.GetCustomerOrderAsync(crVM.OrderID); //get order
                existingOrder.CustomerReviewID = customerReview.CustomerReviewID; //assign review to order
                await _repository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }

            return Ok(customerReview);
        }
    }
}
