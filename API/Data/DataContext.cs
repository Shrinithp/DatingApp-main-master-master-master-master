using API.Entities;
using Microsoft.EntityFrameworkCore;
 namespace API.Data
{
    public class DataContext:DbContext
    {
        //creating a class.
        public DataContext(DbContextOptions options): base(options)
        {

        }
        //our table name is going to be users and the columns inside our User table are column for Id and column for users(inside AppUsers)
        public DbSet<AppUser> Users { get; set;}

        public DbSet<UserLike> Likes { get; set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

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


        }


    }
}