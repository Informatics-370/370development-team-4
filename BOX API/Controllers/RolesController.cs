using BOX.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
                var results = await _repository.GetAllRolesAsync();
                return Ok(results);
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
                var role = new Role { Description = newRole.Description };

                // Check if role exists, create it if necessary
                var roleExists = await _roleManager.RoleExistsAsync(role.Description);
                if (!roleExists)//If role does not exist, add to AspNetRoles
                {
                    await _roleManager.CreateAsync(new IdentityRole(role.Description));
                    _repository.Add(role);
                    await _repository.SaveChangesAsync();
                    return StatusCode(StatusCodes.Status201Created, $"The role '{ newRole.Description }' has been created successfully ");
                }
                else//If role does exist, do not add to AspNetRoles
                {
                    if (roleExists)//If the role exists, do not add anywhere
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, $"This role '{ newRole.Description }' already exists. Please create a new one");
                    }
                    else//else add a new role
                    {
                        _repository.Add(role);
                        await _repository.SaveChangesAsync();
                        return StatusCode(StatusCodes.Status201Created, $"The role '{ newRole.Description }' has been created successfully ");
                    }
                }
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

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
                    return StatusCode(StatusCodes.Status200OK, $"{ existingRole } has been updated successfully.");
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
                    return StatusCode(StatusCodes.Status200OK, $"{ existingRole } has been deleted successfully.");

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }
    }
}
