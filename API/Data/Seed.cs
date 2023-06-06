using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            //to check db has seeding already
            if(await context.Users.AnyAsync()) return;
            //if we donot have seed

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            //to check everythngs is in Pascel casing

            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive=true};
            //deserialize because we want tot transform from json to c#
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            foreach(var user in users)
            {
                using var hmac = new HMACSHA512();
                user.UserName=user.UserName.ToLower();
                user.PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
                user.PasswordSalt=hmac.Key;

                context.Users.Add(user);
                
            } 
            await context.SaveChangesAsync();
        }
    }
}