using BOX.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BOX.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CustomerController : ControllerBase
  {

    private readonly IRepository _repository;

    public CustomerController(IRepository repository)
    {
      _repository = repository;
    }


    // GET: api/<CustomerController>
    [HttpGet]
    public IEnumerable<string> Get()
    {
      return new string[] { "value1", "value2" };
    }


    [HttpGet]
    [Route("GetCustomer/{customerId}")]
    public async Task<IActionResult> GetCustomerAsync(int customerId)
    {
      try
      {
        var result = await _repository.GetCustomerAsync(customerId);

        if (result == null) return NotFound("Customer does not exist on system");

        return Ok(result);
      }
      catch (Exception)
      {
        return StatusCode(500, "Internal Server Error. Please contact BOX support");
      }
    }

    // POST api/<CustomerController>
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT api/<CustomerController>/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE api/<CustomerController>/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
  }
}
