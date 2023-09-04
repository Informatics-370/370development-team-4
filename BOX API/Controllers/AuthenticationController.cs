using BOX.Models;
using BOX.Services;
using BOX.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;
using Twilio.Types;
using Twilio.Clients;
using Twilio.Rest.Api.V2010.Account;
using Microsoft.AspNetCore.SignalR;
using BOX.Hub;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepository _repository;
        private readonly IUserClaimsPrincipalFactory<User> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IEmailService _emailService;
        private readonly AppDbContext _dbContext;
        private readonly ITwilioRestClient _client;
        private readonly IHubContext<RegistrationHub> _hubContext;

        public AuthenticationController(UserManager<User> userManager,
            IUserClaimsPrincipalFactory<User> claimsPrincipalFactory,
            IConfiguration configuration, IRepository repository,
            RoleManager<IdentityRole> roleManager,
            SignInManager<User> signInManager,
            IEmailService emailService,
            AppDbContext dbContext,
            ITwilioRestClient client,
            IHubContext<RegistrationHub> hubContext)
        {
            _userManager = userManager;
            _claimsPrincipalFactory = claimsPrincipalFactory;
            _configuration = configuration;
            _repository = repository;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _emailService = emailService;
            _dbContext = dbContext;
            _client = client;
            _hubContext = hubContext;
        }

        //***************************** Customer **********************************
        //=========================== REGISTRATION ================================
        //----------------------------- Register ----------------------------------
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register(UserViewModel uvm)
        {
            //Takes the user email
            var user = await _userManager.FindByNameAsync(uvm.emailaddress);

            // Assign role based on email address
            var role = uvm.emailaddress.EndsWith(".admin@megapack.com") ? "Admin" : "Customer";

            // If the user is not found
            if (user == null)
            {
                try
                {
                    // Instantiate (create) a new User
                    user = new User
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserName = uvm.emailaddress,
                        Email = uvm.emailaddress,
                        PhoneNumber = uvm.phoneNumber,
                        user_FirstName = uvm.firstName,
                        user_LastName = uvm.lastName,
                        user_Address = uvm.address,
                        TitleID = uvm.title,
                        TwoFactorEnabled = false
                    };

                    // Instantiate (create) a new Customer
                    var customer = new Customer
                    {
                        CustomerId = Guid.NewGuid().ToString(),
                        UserId = user.Id,
                        EmployeeId = "",
                        isBusiness = uvm.isBusiness,
                        vatNo = uvm.vatNo,
                        creditLimit = 0, // default of 0
                        creditBalance = 0, // default of 0
                        discount = 0 // default of 0
                    };

                    var result = await _userManager.CreateAsync(user, uvm.password);

                    if (result.Succeeded)
                    {
                        // Check if role exists, create it if necessary
                        var roleExists = await _roleManager.RoleExistsAsync(role);
                        if (!roleExists)
                        {
                            await _roleManager.CreateAsync(new IdentityRole(role));
                        }                        

                        // Create the customer
                        _repository.Add(customer);
                        await _repository.SaveChangesAsync();

                        // Store the registration message in the database
                        var registrationMessage = $"New registration: {uvm.firstName} {uvm.lastName} has signed up to Mega Pack using this email address. ({uvm.emailaddress}) \n\n Please assign {uvm.firstName} {uvm.lastName} to a sales consultant as soon as possible";
                        _dbContext.RegisterMessages.Add(new RegisterMessages { message = registrationMessage });
                        await _dbContext.SaveChangesAsync();

                        await _hubContext.Clients.All.SendAsync("SendRegistrationAlert", registrationMessage);

                        // Assign the user to a customer role
                        await _userManager.AddToRoleAsync(user, role);

                        // Add Token to Verify Email
                        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        var protocol = "http://localhost:4200/confirm-email";
                        var confirmEmailLink = protocol + "?token=" + HttpUtility.UrlEncode(token) + "&email=" + Convert.ToBase64String(Encoding.UTF8.GetBytes(uvm.emailaddress));
                        var message = new Message(new string[] { user.Email! }, "Confirmation Email Link", "Dear user,\n\n Thank you for registering with MegaPack. Click the link below to verify your email: \n" + confirmEmailLink);
                        _emailService.SendEmail(message);

                        // Return success
                        return Ok();
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support." + result.ToString());
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support." + ex.Message + " inner exception " + ex.InnerException);
                }
            }
            else
            {
                return Forbid("Account already exists.");
            }

        }

        [HttpGet]
        [Route("GetAllTitles")]
        public async Task<ActionResult<IEnumerable<Title>>> GetAllTitles()
        {
            var titles = await _dbContext.Title.ToListAsync();

            return titles;
        }


        [HttpPost("send-sms")]
        public IActionResult SendSms(string phoneNumber)
        {
            var sms = MessageResource.Create(
                            to: new PhoneNumber("+27832448443"),
                            from: new PhoneNumber("+17075498722"),
                            body: "Hello Kuziwa. This is Ismail Starke from MegaPack!",
                            client: _client);

            return Ok("Success" + sms);
        }

        //--------------------------- Confirm Email -------------------------------
        [HttpGet]
        [Route("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            // Check if the user exists
            var user = await _userManager.FindByNameAsync(email);

            if (user != null)
            {
                var result = await _userManager.ConfirmEmailAsync(user, token);
                if (result.Succeeded)
                {
                    return Ok();
                }
            }
            return BadRequest();
        }

        //----------------------- Get Email Confirmation --------------------------
        [HttpGet]
        [Route("GetConfirmEmailStatus")]
        public async Task<IActionResult> GetConfirmEmailStatus(string email)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(email);

                if (user != null)
                {
                    return Ok(new { EmailConfirmed = user.EmailConfirmed });
                }

                return NotFound("User not found");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error: " + ex.Message);
            }
        }

        //=============================== Login ===================================
        //------------------------------- Login -----------------------------------
        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var user = await _userManager.FindByNameAsync(dto.emailaddress);

            if (user != null && await _userManager.CheckPasswordAsync(user, dto.password))
            {
                try
                {
                    var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };
                    var userRoles = await _userManager.GetRolesAsync(user);
                    foreach (var role in userRoles)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, role));
                    }
                    if (user.TwoFactorEnabled)
                    {
                        await _signInManager.SignOutAsync();
                        await _signInManager.PasswordSignInAsync(user, dto.password, false, true);
                        var signIn = await _signInManager.PasswordSignInAsync(user, dto.password, false, true);
                        var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");
                        var body = "Dear user,\n\n Thank you for choosing MegaPack for your secure login. Plese use the following One-Time Password to complete your login process:\n OTP: " + token + "\n\n If you did not request this OTP, please ignore this email. \n\n Best regards, \n MegaPack Team";
                        var message = new Message(new string[] { user.Email! }, "OTP Confirmation", body);
                        _emailService.SendEmail(message);

                        return Ok();
                    }
                    return GenerateJwtToken(user);
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support. " + ex);
                }
            }
            else
            {
                return NotFound("User does not exist");
            }
        }

        //-------------------------- Login with OTP -------------------------------
        [HttpPost]
        [Route("Login2FA")]
        public async Task<IActionResult> LoginWithOTP(string otp, string username)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(username);
                var signIn = await _signInManager.TwoFactorSignInAsync("Email", otp, false, true);
                if (signIn.Succeeded)
                {
                    if (user != null)
                    {
                        var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };

                        var userRoles = await _userManager.GetRolesAsync(user);
                        foreach (var role in userRoles)
                        {
                            authClaims.Add(new Claim(ClaimTypes.Role, role));
                        }

                        return GenerateJwtToken(user);

                    }
                    else
                    {
                        //Return an error message if the user does not exist
                        return StatusCode(StatusCodes.Status404NotFound, "Invalid OTP");
                    }
                }
                return BadRequest("First verify your email before you can log in.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            
        }

        //------------------------ Generate JWT Token -----------------------------
        [HttpGet]
        private ActionResult GenerateJwtToken(User user)
        {
            var userRoles = _userManager.GetRolesAsync(user).Result;

            // Create JWT Token
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim("UserId", user.Id)
            }.ToList();

            claims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Tokens:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Tokens:Issuer"],
                _configuration["Tokens:Audience"],
                claims,
                signingCredentials: credentials,
                expires: DateTime.UtcNow.AddHours(3)
            );

            return Created("", new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = user.UserName,
                userId = user.Id
            });
        }

        //----------------------- Get Two Factor Status ---------------------------
        [HttpGet]
        [Route("GetTwoFactorStatus")]
        public async Task<IActionResult> GetTwoFactorStatus(string email)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(email);

                if (user != null)
                {
                    return Ok(new { TwoFactorEnabled = user.TwoFactorEnabled });
                }

                return NotFound("User not found");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error: " + ex.Message);
            }
        }
        
        //-------------------------- Forgot Password ------------------------------
        //Sends the email to the user
        [HttpPost]
        [Route("ForgotPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist or is not confirmed
                return BadRequest("Invalid request");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var frontendResetPasswordLink = "http://localhost:4200/forgot-password";
            var resetPasswordLink = frontendResetPasswordLink + "?token=" + HttpUtility.UrlEncode(token) + "&email=" + HttpUtility.UrlEncode(model.Email);

            var message = new Message(new string[] { user.Email }, "Password Reset", "Click the link below to reset your password: " + resetPasswordLink);
            _emailService.SendEmail(message);

            return Ok("Password reset link sent successfully");
        }

        //-------------------------- Change Password ------------------------------
        [HttpPost]
        [Route("ChangePassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ChangePassword(ResetPassword resetPassword)
        {
            var user = await _userManager.FindByNameAsync(resetPassword.Email);
            if (user != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                resetPassword.Token = token;

                var resetPassResult = await _userManager.ResetPasswordAsync(user, resetPassword.Token, resetPassword.Password);
                if (!resetPassResult.Succeeded)
                {
                    foreach (var error in resetPassResult.Errors)
                    {
                        ModelState.AddModelError(error.Code, error.Description);
                    }
                }
                return StatusCode(StatusCodes.Status200OK, "Password has been changed");
            }
            return StatusCode(StatusCodes.Status400BadRequest, "Error");
        }

        //--------------------------- Reset Password ------------------------------
        [HttpGet]
        [Route("ResetPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(string token, string email)
        {
            var model = new ResetPasswordViewModel { Token = token, Email = email };
            return Ok(new { model });
        }

        //***************************** Employee **********************************
        [HttpPost]
        [Route("RegisterEmployee")]
        public async Task<IActionResult> RegisterEmployee(EmployeeViewModel uvm)
        {
            //Takes the user email
            var user = await _userManager.FindByNameAsync(uvm.emailaddress);

            // Assign role based on email address
            var role = "Employee";

            // If the user is not found
            if (user == null)
            {
                // Instantiate (create) a new User
                user = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = uvm.emailaddress,
                    Email = uvm.emailaddress,
                    PhoneNumber = uvm.phoneNumber,
                    user_FirstName = uvm.firstName,
                    user_LastName = uvm.lastName,
                    user_Address = uvm.address,
                    TitleID = uvm.title,
                    TwoFactorEnabled = false
                };

                // Instantiate (create) a new Employee
                var employee = new Employee
                {
                    EmployeeId = Guid.NewGuid().ToString(),
                    UserId = user.Id
                };

                var password = GenerateRandomPassword();

                var result = await _userManager.CreateAsync(user, password);

                if (result.Succeeded)
                {
                    // Check if role exists, create it if necessary
                    var roleExists = await _roleManager.RoleExistsAsync(role);
                    if (!roleExists)
                    {
                        await _roleManager.CreateAsync(new IdentityRole(role));
                    }

                    // Create the customer
                    _repository.Add(employee);
                    await _repository.SaveChangesAsync();

                    // Assign the user to a customer role
                    await _userManager.AddToRoleAsync(user, role);

                    // Add Token to Verify Email
                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    var protocol = "http://localhost:4200/confirm-email";
                    var confirmEmailLink = protocol + "?token=" + HttpUtility.UrlEncode(token) + "&email=" + Convert.ToBase64String(Encoding.UTF8.GetBytes(uvm.emailaddress));
                    var details = $"Your new login details are as follows: \n Username: { uvm.emailaddress } \n Password: { password } \n\n Please update your password as soon as possible";
                    var message = new Message(new string[] { user.Email! }, "Confirmation Email Link", $"Dear { uvm.firstName } { uvm.lastName },\n\nCongratulations and Welcome to MegaPack! \nClick the link below to verify your email. You need to confirm your email before you are able to login: \n" + confirmEmailLink + "\n\n" + details);
                    _emailService.SendEmail(message);

                    // Return success
                    return Ok();
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
                }
            }
            else
            {
                return Forbid("Account already exists.");
            }

        }

        // Method to generate a random password
        private string GenerateRandomPassword()
        {
            const string allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
            const int passwordLength = 12;

            var random = new Random();
            var password = new StringBuilder(passwordLength);

            // Ensure at least one uppercase letter, one lowercase letter, and one digit
            password.Append(allowedChars[random.Next(26)]); // At least one lowercase letter
            password.Append(allowedChars[random.Next(26, 52)]); // At least one uppercase letter
            password.Append(allowedChars[random.Next(52, 62)]); // At least one digit

            // Fill the rest of the password with random characters
            for (int i = 3; i < passwordLength; i++)
            {
                password.Append(allowedChars[random.Next(allowedChars.Length)]);
            }

            return password.ToString();
        }

            [HttpGet]
            [Route("GetAllMessages")]
            public async Task<IActionResult> GetAllMessages()
            {
                try
                {
                    var messages = await _dbContext.RegisterMessages.ToListAsync();
                    return Ok(messages);
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error: " + ex.Message);
                }
            }

            [HttpDelete]
            [Route("ClearAllMessages")]
            public async Task<IActionResult> ClearAllMessages()
            {
                try
                {
                    _dbContext.RegisterMessages.RemoveRange(_dbContext.RegisterMessages);
                    await _dbContext.SaveChangesAsync();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error: " + ex.Message);
                }
            }


        [HttpPut]
        [Route("AssignEmployee/{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] AssignEmpDTO assignEmp)
        {
            var customer = await _repository.GetCustomerByUserId(userId);

            if (customer == null)
            {
                return NotFound(); // User not found
            }

            var employee = await _dbContext.Employee
                .Include(e => e.User) // Include the User details of the employee
                .FirstOrDefaultAsync(e => e.EmployeeId == assignEmp.EmployeeId);

            if (employee == null)
            {
                return NotFound(); // Employee not found
            }

            // Update the user's properties with the values from the updatedUser DTO
            customer.EmployeeId = assignEmp.EmployeeId;

            // Send email to customer
            var customerMessage = new Message(new string[] { customer.User.Email }, 
                "Meet Your Sales Consultant", 
                $"Dear {customer.User.user_FirstName} {customer.User.user_LastName}," +
                $"\n\nThank you for choosing to shop with Mega Pack. The employee assigned to you is: " +
                $"\nName: {employee.User.user_FirstName} " +
                $"\nSurname: {employee.User.user_LastName}. " +
                $"\nPhone Number: {employee.User.PhoneNumber} " +
                $"\n\nWhenever you request a quote, our sales consultant will be in contact " +
                $"with you to discuss the quotation and to engage in any sort of negotiations " +
                $"if you are not happy with the price. Once you have both agreed on a price, " +
                $"the consultant will issue you a quote which you can find under the quotes " +
                $"section of your profile. In this section, you may accept or reject the quote. " +
                $"\n\n Enjoy your day \nThe Mega Pack Team");
            _emailService.SendEmail(customerMessage);

            var employeeMessage = new Message(new string[] { employee.User.Email },
                "Welcome Your New Client",
                $"Dear {employee.User.user_FirstName} {employee.User.user_LastName}," +
                $"\n\nWe are pleased to inform you that you have been assigned a new client at Mega Pack." +
                $"\n\nClient Details:" +
                $"\nName: {customer.User.user_FirstName} {customer.User.user_LastName}" +
                $"\nEmail: {customer.User.Email}" +
                $"\nPhone Number: {customer.User.PhoneNumber}" +
                $"\n\nAs their dedicated sales consultant, your role is to provide exceptional service and assist them with their inquiries and purchases. Your expertise and dedication are vital in ensuring our customers' satisfaction." +
                $"\n\nShould you require any assistance or have any questions, please feel free to reach out to our team." +
                $"\n\nThank you for your commitment to delivering outstanding service. We wish you success in your endeavors with this new client." +
                $"\n\nBest regards,\nMega Pack Sales Team");
            _emailService.SendEmail(employeeMessage);

            await _dbContext.SaveChangesAsync();

            return NoContent(); // Update successful, return 204 No Content response
        }


    }

}
