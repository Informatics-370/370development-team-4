using BOX.Models;
using BOX.Services;
using BOX.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Web;

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

        public AuthenticationController(UserManager<User> userManager, 
            IUserClaimsPrincipalFactory<User> claimsPrincipalFactory, 
            IConfiguration configuration, IRepository repository, 
            RoleManager<IdentityRole> roleManager,
            SignInManager<User> signInManager,
            IEmailService emailService)
        {
            _userManager = userManager;
            _claimsPrincipalFactory = claimsPrincipalFactory;
            _configuration = configuration;
            _repository = repository;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _emailService = emailService;
        }

        //----------------------------------- Register -----------------------------------------
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register(UserViewModel uvm)
        {
            //Takes the user email
            var user = await _userManager.FindByIdAsync(uvm.emailaddress);

            // Assign role based on email address
            var role = uvm.emailaddress.EndsWith(".admin@megapack.com") ? "Admin" : "Customer";

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
                    title = uvm.title,
                    TwoFactorEnabled = true
                };

                // Instantiate (create) a new Customer
                var customer = new Customer
                {
                    CustomerId = Guid.NewGuid().ToString(),
                    UserId = user.Id,
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

                    // Assign the user to a customer role
                    await _userManager.AddToRoleAsync(user, role);

                    // Add Token to Verify Email
                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    var protocol = "http://localhost:4200/confirm-email";
                    var confirmEmailLink = protocol + "?token=" + HttpUtility.UrlEncode(token) + "&email=" + Convert.ToBase64String(Encoding.UTF8.GetBytes(uvm.emailaddress));
                    var message = new Message(new string[] { user.Email! }, "Confirmation Email Link", "Dear user,\n\n Thank you for registering with MegaPack. Click the link below to verify your email: \n" + confirmEmailLink );
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

        //----------------------------------- Confirm Email ---------------------------------------
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

        //----------------------------------- Login --------------------------------------------
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


        //----------------------------- Login with OTP ------------------------------------
        [HttpPost]
        [Route("Login2FA")]
        public async Task<IActionResult> LoginWithOTP(string otp, string username)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(username);
                var signIn = await _signInManager.TwoFactorSignInAsync("Email", otp, false, false);
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

        //-------------------------------- Generate JWT Token ---------------------------------
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

        //-------------------------------- Forgot Password ---------------------------------
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

        //Acutally change the password
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

        [HttpGet]
        [Route("ResetPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(string token, string email)
        {
            var model = new ResetPasswordViewModel { Token = token, Email = email };
            return Ok(new { model });
        }

    }
}
