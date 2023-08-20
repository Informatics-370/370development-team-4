using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using BOX.Models;
using BOX.Services;
using BOX.ViewModel;
using Org.BouncyCastle.Bcpg;
using System.Text;
using System.Web;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepository _repository;
        private readonly IUserClaimsPrincipalFactory<User> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IEmailService _emailService;
        private readonly AppDbContext _dbContext;

        public EmployeeController(UserManager<User> userManager,
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
        [Route("GetAllEmployees")]
        public async Task<ActionResult<IEnumerable<EmployeeDTO>>> GetAllEmployees()
        {
            var employees = await _dbContext.Users
                .Join(_dbContext.UserRoles, u => u.Id, ur => ur.UserId, (u, ur) => new { User = u, UserRole = ur })
                .Join(_dbContext.Roles, ur => ur.UserRole.RoleId, r => r.Id, (ur, r) => new { User = ur.User, Role = r })
                .Where(x => x.Role.Name == "Employee")
                .Join(_dbContext.Employee, u => u.User.Id, e => e.UserId, (u, e) => new { User = u.User, Employee = e })
                .Select(u => new EmployeeDTO
                {
                    EmployeeId = u.Employee.EmployeeId,
                    FirstName = u.User.user_FirstName,
                    LastName = u.User.user_LastName,
                    Email = u.User.Email,
                    Address = u.User.user_Address,
                    Title = u.User.title,
                    PhoneNumber = u.User.PhoneNumber,
                    UserId = u.User.Id
                })
                .ToListAsync();

            return employees;
        }


    }
}
