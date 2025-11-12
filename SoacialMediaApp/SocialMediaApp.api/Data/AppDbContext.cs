using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Entities;

namespace SocialMediaApp.api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<UserLike>()
            .HasKey(tmp => new { tmp.SourceUserID, tmp.TargetUserID }); //this line

        modelBuilder.Entity<UserLike>()
            .HasOne(tmp => tmp.SourceUser)
            .WithMany(tmp => tmp.LikedUsers)
            .HasForeignKey(tmp => tmp.SourceUserID)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserLike>()
            .HasOne(tmp => tmp.TargetUser)
            .WithMany(tmp => tmp.LikedByUsers)
            .HasForeignKey(tmp => tmp.TargetUserID)
            .OnDelete(DeleteBehavior.NoAction);
    }
}