using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Entities;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace SocialMediaApp.api.Data;

public class Seed
{
    public static async Task SeedUser(AppDbContext db)
    {
        if (await db.Users.AnyAsync()) return;
        var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);
        if(users == null) return;
        foreach (var user in users)
        {
            user.UserName = user.UserName.ToLower();
            using var hmac = new HMACSHA512();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
            user.PasswordSalt = hmac.Key;

            db.Users.Add(user);
        }
        await db.SaveChangesAsync();
    }
}
