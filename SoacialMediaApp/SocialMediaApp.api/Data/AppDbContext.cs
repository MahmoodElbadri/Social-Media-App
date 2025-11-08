using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Entities;

namespace SocialMediaApp.api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        //modelBuilder.Entity<AppUser>()
        //    .HasData(
        //        new AppUser
        //        {
        //            ID = 1, UserName = "bobby", PasswordHash = new byte[] { 0x00 },
        //            PasswordSalt = new byte[] { 0x00 }
        //        },
        //        new AppUser
        //        {
        //            ID = 2, UserName = "tom", PasswordHash = new byte[] { 0x00 },
        //            PasswordSalt = new byte[] { 0x00 }
        //        },
        //        new AppUser
        //        {
        //            ID = 3, UserName = "jane", PasswordHash = new byte[] { 0x00 },
        //            PasswordSalt = new byte[] { 0x00 }
        //        }
        //    );
    }
}