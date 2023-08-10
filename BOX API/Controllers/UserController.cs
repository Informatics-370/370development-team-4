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
                    Title = u.title,
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
                    FirstName = u.user_FirstName,
                    LastName = u.user_LastName,
                    Email = u.Email,
                    Address = u.user_Address,
                    Title = u.title,
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
            user.user_FirstName = updatedUser.FirstName;
            user.user_LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            user.user_Address = updatedUser.Address;
            user.title = updatedUser.Title;
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




    }
}
