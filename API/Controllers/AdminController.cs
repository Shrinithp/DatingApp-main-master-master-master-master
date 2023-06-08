using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController: BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;

        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        //RequireAdminRole is given inside Identityservices
        [Authorize(Policy ="RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users
            .OrderBy(u => u.UserName)
            .Select(u => new{
                u.Id,
                Username = u.UserName,
                Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
            })
            .ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy ="RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery]string roles)
        {
            if(string.IsNullOrEmpty(roles)) return BadRequest("you must atleast select one role");

            //roles which need to be updated is stored here
            var selectedRoles = roles.Split(",").ToArray();

            //username whose role needs to be edited is stored here
            var user = await _userManager.FindByNameAsync(username);

            if(user==null) return NotFound();

            //current role of the user is stored here
            var userRoles = await _userManager.GetRolesAsync(user);

            //update the role here
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if(!result.Succeeded) return BadRequest("failed to add to roles");


            //removing previous role
            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if(!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }



        [Authorize(Policy ="ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]

        public ActionResult GetPhotosForModeration()
        {
            return Ok("Admins or moderate can see this");
        }
    }
}