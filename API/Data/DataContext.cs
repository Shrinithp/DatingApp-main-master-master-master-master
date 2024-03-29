using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace API.Data
{

    //order should be same aswell.
    public class DataContext: IdentityDbContext<AppUser, AppRole, int,
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
    IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        //creating a class.
        public DataContext(DbContextOptions options): base(options)
        {

        }
        //our table name is going to be users and the columns inside our User table are column for Id and column for users(inside AppUsers)

        public DbSet<UserLike> Likes { get; set;}

        public DbSet<Message> Messages {get; set;}

        public DbSet<Group> Groups {get; set;}

        public DbSet<Connection> Connections {get;set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


        //each role can have many users inside a particluar role. Each user can be a member of many roles
            builder.Entity<AppUser>()
            .HasMany(ur=>ur.UserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur=>ur.UserId)
            .IsRequired();
            


             builder.Entity<AppRole>()
            .HasMany(ur=>ur.UserRoles)
            .WithOne(u => u.Role)
            .HasForeignKey(ur=>ur.RoleId)
            .IsRequired();

            builder.Entity<UserLike>()
            .HasKey(k=>new {k.SourceUserId, k.TargetUserId});

             builder.Entity<UserLike>()
             .HasOne(s=>s.SourceUser)
             .WithMany(l=>l.LikedUsers)
             .HasForeignKey(s=>s.SourceUserId)
             .OnDelete(DeleteBehavior.Cascade);

             builder.Entity<UserLike>()
             .HasOne(s=>s.TargetUser)
             .WithMany(l=>l.LikedByUsers)
             .HasForeignKey(s=>s.TargetUserId)
             .OnDelete(DeleteBehavior.Cascade);


             builder.Entity<Message>()
             .HasOne(u=> u.Recipient)
             .WithMany(m=>m.MessagesReceived)
             .OnDelete(DeleteBehavior.Restrict);

              builder.Entity<Message>()
             .HasOne(u=> u.Sender)
             .WithMany(m=>m.MessagesSent)
             .OnDelete(DeleteBehavior.Restrict);


        }


    }
}