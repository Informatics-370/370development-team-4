using BOX.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRepository _repository;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RolesController(IRepository repository,
            RoleManager<IdentityRole> roleManager)
        {
            _repository = repository;
            _roleManager = roleManager;
        }

        //------------------------------ GET ALL ROLES ------------------------------

        [HttpGet]
        [Route("GetAllRoles")]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var roles = await _roleManager.Roles.ToListAsync(); // Retrieve all roles from the AspNetRoles table
                return Ok(roles);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
            }
        }


        //------------------------------ GET ONE ROLE ------------------------------

        [HttpGet]
        [Route("GetRole/{RoleId}")]
        public async Task<IActionResult> GetRoleAsync(int RoleId)
        {
            try
            {
                var result = await _repository.GetRoleAsync(RoleId);

                if (result == null) return NotFound("Role does not exist on system");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact BOX support");
            }
        }

        //------------------------------ CREATE ROLE ------------------------------

        [HttpPost]
        [Route("CreateRole")]
        public async Task<IActionResult> CreateRole(Role newRole)
        {
            try
            {
                // Check if role exists, create it if necessary
                var roleExists = await _roleManager.RoleExistsAsync(newRole.Description);
                if (!roleExists)
                {
                    await _roleManager.CreateAsync(new IdentityRole(newRole.Description));
                }

                _repository.Add(newRole);
                await _repository.SaveChangesAsync();

                return StatusCode(StatusCodes.Status201Created, newRole);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        //---------------------------- ADD PERMISSIONS -----------------------------
        //[HttpPost]
        //[Route("AddPermissionsToRole/{RoleId}")]
        //public async Task<IActionResult> AddPermissionsToRole(int RoleId, List<Permission> permissions)
        //{
        //    try
        //    {
        //        var existingRole = await _repository.GetRoleAsync(RoleId);
        //        if (existingRole == null)
        //        {
        //            return NotFound($"The role with ID {RoleId} does not exist on the B.O.X System.");
        //        }

        //        var role = await _roleManager.FindByNameAsync(existingRole.Description);
        //        if (role == null)
        //        {
        //            return NotFound($"The role with ID {RoleId} does not exist in the RoleManager.");
        //        }

        //        // Add the permissions to the role
        //        foreach (var permission in permissions)
        //        {
        //            var claim = new Claim("Permission", permission.Name);
        //            var result = await _roleManager.AddClaimAsync(role, claim);
        //            if (!result.Succeeded)
        //            {
        //                return BadRequest("Failed to add permissions to the role.");
        //            }
        //        }

        //        return Ok("Permissions added to the role successfully.");
        //    }
        //    catch (Exception)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
        //    }
        //}


        //------------------------------ UPDATE ROLE ------------------------------
        [HttpPut]
        [Route("UpdateRole/{RoleId}")]
        public async Task<ActionResult<Role>> UpdateRole(int RoleId, Role updatedRole)
        {
            try
            {
                var existingRole = await _repository.GetRoleAsync(RoleId);
                if (existingRole == null ) 
                    return NotFound($"The role '{ existingRole }' does not exist on the B.O.X System.");


                existingRole.Description = updatedRole.Description;


                if (await _repository.SaveChangesAsync())
                {
                    return Ok(existingRole);
                }
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact BOX support.");
            }
            return StatusCode(StatusCodes.Status400BadRequest, "Your request is invalid.");
        }

        //------------------------------ DELETE ROLE ------------------------------
        [HttpDelete]
        [Route("DeleteRole/{RoleId}")]
        public async Task<IActionResult> DeleteRole(int RoleId)
        {
            try
            {
                var existingRole = await _repository.GetRoleAsync(RoleId);

                if (existingRole == null) 
                    return NotFound($"The role '{ existingRole }' does not exist on the B.O.X System");

                _repository.Delete(existingRole);

                if (await _repository.SaveChangesAsync()) 
                    return Ok(existingRole);

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }
    }
}
