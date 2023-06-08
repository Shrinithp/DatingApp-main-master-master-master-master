using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {

        //UserManager Provides the APIs for managing user in a persistence store
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            //to check db has seeding already
            if(await userManager.Users.AnyAsync()) return;
            //if we donot have seed

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            //to check everythngs is in Pascel casing

            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive=true};
            //deserialize because we want tot transform from json to c#
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            var roles = new List<AppRole>
            {
                new AppRole{Name="Member"},
                new AppRole{Name="Admin"},
                new AppRole{Name="Moderator"},
            };

            foreach(var role in roles)
            {
                await roleManager.CreateAsync(role);
            }



            foreach(var user in users)
            {
                user.UserName=user.UserName.ToLower();
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");
            } 

            var admin = new AppUser
            { 
                UserName="admin"
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            //add user to multiple roles
            await userManager.AddToRolesAsync(admin, new[] {"Admin", "Moderator"});
            
        }
    }
}