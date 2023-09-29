//using BOX.Migrations;
using BOX.Models;
using BOX.Services;
using BOX.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepository _repository;
        private readonly IUserClaimsPrincipalFactory<User> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IEmailService _emailService;
        private readonly AppDbContext _dbContext;

        public UserController(UserManager<User> userManager,
            IUserClaimsPrincipalFactory<User> claimsPrincipalFactory,
            IConfiguration configuration, IRepository repository,
            RoleManager<IdentityRole> roleManager,
            SignInManager<User> signInManager,
            IEmailService emailService,
            AppDbContext dbContext)
        {
            _userManager = userManager;
            _claimsPrincipalFactory = claimsPrincipalFactory;
            _configuration = configuration;
            _repository = repository;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _emailService = emailService;
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            var users = await _dbContext.Users
                .Select(u => new UserDTO
                {
                    FirstName = u.user_FirstName,
                    LastName = u.user_LastName,
                    Email = u.Email,
                    Address = u.user_Address,
                    PhoneNumber = u.PhoneNumber
                })
                .ToListAsync();

            return users;
        }

        [HttpGet]
        [Route("GetUserByEmail/{email}")]
        public async Task<ActionResult<UserDTO>> GetUserByEmail(string email)
        {
            var user = await _dbContext.Users
                .Where(u => u.Email == email)
                .Select(u => new UserDTO
                {
                    Id = u.Id,
                    FirstName = u.user_FirstName,
                    LastName = u.user_LastName,
                    Email = u.Email,
                    Address = u.user_Address,
                    PhoneNumber = u.PhoneNumber
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(); // User not found
            }

            return user;
        }

        [HttpPut]
        [Route("UpdateUser/{email}")]
        public async Task<IActionResult> UpdateUser(string email, [FromBody] UserDTO updatedUser)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound(); // User not found
            }

            // Update the user's properties with the values from the updatedUser DTO
            user.Id = user.Id;
            user.user_FirstName = updatedUser.FirstName;
            user.user_LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            user.user_Address = updatedUser.Address;
            user.PhoneNumber = updatedUser.PhoneNumber;

            await _dbContext.SaveChangesAsync();

            return NoContent(); // Update successful, return 204 No Content response
        }

        [HttpDelete]
        [Route("DeleteUser/{email}")]
        public async Task<IActionResult> DeleteUser(string email)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound(); // User not found
            }

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();

            return NoContent(); // Deletion successful, return 204 No Content response
        }

        [HttpGet]
        [Route("GetAllCustomers")]
        public async Task<ActionResult<IEnumerable<GetCustomerDTO>>> GetAllCustomers()
        {
            var customers = await _dbContext.Customer
                .Include(c => c.User) // Include the User navigation property
                //.Include(c => c.Employee) // Include the Employee navigation property
                .Select(c => new GetCustomerDTO
                {
                    CustomerId = c.CustomerId,
                    UserId = c.UserId,
                    //EmployeeId = c.EmployeeId,
                    IsBusiness = c.isBusiness,
                    VatNo = c.vatNo,
                    CreditLimit = c.creditLimit,
                    CreditBalance = c.creditBalance,
                    Discount = c.discount,
                    User = new UserDTO // Include user information
                    {
                        FirstName = c.User.user_FirstName,
                        LastName = c.User.user_LastName,
                        Address = c.User.user_Address,
                        Title = c.User.Title.Description,
                        Email = c.User.Email,
                        PhoneNumber = c.User.PhoneNumber
                    },
                    Employee = new EmployeeDTO // Include employee information from User table
                    {
                        UserId = c.UserId,
                        /*EmployeeId = c.EmployeeId,
                        FirstName = c.Employee.User.user_FirstName,
                        LastName = c.Employee.User.user_LastName,
                        Address = c.Employee.User.user_Address,
                        Title = c.Employee.User.Title.Description,*/
                        Email = c.User.Email, 
                        PhoneNumber = c.User.PhoneNumber
                    }
                })
                .ToListAsync();

            return customers;
        }


        [HttpGet]
        [Route("GetCustomerByCustomerId/{customerId}")]
        public async Task<ActionResult<CustomerDTO>> GetCustomerByCustomerId(string customerId)
        {
            var customer = await _dbContext.Customer
                .Where(c => c.CustomerId == customerId)
                .Select(c => new CustomerDTO
                {
                    CustomerId = c.CustomerId,
                    UserId = c.UserId,
                    EmployeeId = c.EmployeeId,
                    IsBusiness = c.isBusiness,
                    VatNo = c.vatNo,
                    CreditLimit = c.creditLimit,
                    CreditBalance = c.creditBalance,
                    Discount = c.discount
                })
                .FirstOrDefaultAsync();

            if (customer == null)
            {
                return NotFound(); // Customer not found
            }

            return customer;
        }

        [HttpGet]
        [Route("GetCustomerByUserId/{userId}")]
        public async Task<IActionResult> GetCustomerByUserId(string userId)
        {
            var customer = await _repository.GetCustomerByUserId(userId);
            var user = await _repository.GetUserAsync(userId);
            AllCustomerDetailsViewModel customerDetails;

            if (user == null) return NotFound("User does not exist on the B.O.X system");
            else if (customer == null)
            { //if user is not null but customer is null, then it isn't a customer. It's some other kind of user
                string fullname = await _repository.GetUserFullNameAsync(userId);

                customerDetails = new AllCustomerDetailsViewModel
                {
                    CustomerId = "",
                    UserId = userId,
                    EmailConfirmed = user.EmailConfirmed,
                    FullName = fullname,
                    FirstName = user.user_FirstName,
                    LastName = user.user_LastName,
                    Email = user.Email,
                    Address = user.user_Address,
                    PhoneNumber = user.PhoneNumber,
                    EmployeeId = "",
                    IsBusiness = false,
                    VatNo = "",
                    CreditBalance = 0,
                    CreditLimit = 0
                };
            }
            else
            {
                string fullname = await _repository.GetUserFullNameAsync(userId);

                customerDetails = new AllCustomerDetailsViewModel
                {
                    CustomerId = customer.CustomerId,
                    UserId = userId,
                    EmailConfirmed = user.EmailConfirmed,
                    FullName = fullname,
                    FirstName = user.user_FirstName,
                    LastName = user.user_LastName,
                    Email = user.Email,
                    Address = user.user_Address,
                    PhoneNumber = user.PhoneNumber,
                    EmployeeId = customer.EmployeeId,
                    IsBusiness = customer.isBusiness,
                    VatNo = customer.vatNo,
                    CreditBalance = customer.creditBalance == null ? 0 : customer.creditBalance.Value,
                    CreditLimit = customer.creditLimit == null ? 0 : customer.creditLimit.Value
                };
            }

            return Ok(customerDetails);
        }

        [HttpPut]
        [Route("UpdateUserRoleAndNotifyAdmin")]
        public async Task<IActionResult> UpdateUserRoleAndNotifyAdmin(string email, string roleId)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return NotFound(); // User not found
            }

            // Get the role by ID
            var role = await _roleManager.FindByIdAsync(roleId);

            if (role == null)
            {
                return NotFound("Role not found"); // Role not found
            }

            // Remove user from all existing roles
            var existingRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, existingRoles);

            // Add user to the new role
            var addToRoleResult = await _userManager.AddToRoleAsync(user, role.Name);

            if (!addToRoleResult.Succeeded)
            {
                return BadRequest("Failed to update role"); // Role update failed
            }

            if (role.Name == "Admin")
            {
                var admin = new Admin
                {
                    AdminId = Guid.NewGuid().ToString(),
                    UserId = user.Id,
                };
                _repository.Add(admin);
                await _repository.SaveChangesAsync();

                var employeeToDelete = await _repository.GetEmployeeByUserId(user.Id);
                if (employeeToDelete != null)
                {
                    _repository.Delete(employeeToDelete);
                    await _repository.SaveChangesAsync();
                }

                // Send email to the admin
                var message = new Message(new string[] { user.Email }, "Admin Role Update", "Congratulations! You've been assigned the 'Admin' role.");
                _emailService.SendEmail(message);
            }
            else if (role.Name == "Employee")
            {
                var employee = new Employee
                {
                    EmployeeId = Guid.NewGuid().ToString(),
                    UserId = user.Id,
                };

                _repository.Add(employee);
                await _repository.SaveChangesAsync();

                var adminToDelete = await _repository.GetAdminByUserId(user.Id);
                if (adminToDelete != null)
                {
                    _repository.Delete(adminToDelete);
                    await _repository.SaveChangesAsync();
                }

            }

            return NoContent(); // Role updated successfully
        }

        [HttpPut]
        [Route("UpdateCustomerCreditBalance/{userId}/{creditBalance}")]
        public async Task<IActionResult> UpdateCustomerCreditBalance(string userId, int creditBalance)
        {
            var customer = await _repository.GetCustomerByUserId(userId);

            if (customer == null) return NotFound("Customer does not exist on the B.O.X system");

            // Update the customer's credit balance
            customer.creditBalance = creditBalance;

            await _repository.SaveChangesAsync();

            return Ok(creditBalance); // Update successful
        }

    }
}
