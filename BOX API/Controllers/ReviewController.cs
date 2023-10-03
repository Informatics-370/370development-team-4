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
