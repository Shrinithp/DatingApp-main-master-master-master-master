using API.Data;
using API.Entities;
using API.Extensions;
using API.Middleware;
using API.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();


//inoder to use our middleware this particular code is used
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
app.UseCors(builder => builder
.AllowAnyHeader()
.AllowAnyMethod()
.AllowCredentials()
.WithOrigins("http://localhost:4200"));
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<PresenceHub>("hubs/presence"); //same should be there in client side (service)
app.MapHub<MessageHub>("hubs/message"); //same should be there in client side (service)

using var scope =app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
     var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    //Asynchronously applies any pending migrations for 
    //the context to the database and Will create the database if it does not already exist.
    await context.Database.MigrateAsync();

    //remove all previous connections when app crashes
    await context.Database.ExecuteSqlRawAsync("DELETE FROM [CONNECTIONS]");
    await Seed.SeedUsers(userManager, roleManager);
}

catch(Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error occured");
}
app.Run();
