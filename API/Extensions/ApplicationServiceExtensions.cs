using System.Reflection.Metadata.Ecma335;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
         IConfiguration config)
         {
            services.AddDbContext<DataContext>(opt =>
            {
                //connections that to be made needs to be specified here.
                //connection are them made in appsettings.development.json file.
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));

                //after making connections in json file, install migrations of creating all the connections.
                //dotnet tool install --global dotnet-ef --version 7.0.2 is the command to create migration.

            
            });

            services.AddCors();
            //advantages of using interface is when we use coding for testing it is easy, so we have used IToeknServices.
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserRepository, UserRepository>();
            //this is for auto mapper
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<LogUserActivity>();
            services.AddScoped<ILikesRepository, LikesRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();

            return services;
        }
    }
}