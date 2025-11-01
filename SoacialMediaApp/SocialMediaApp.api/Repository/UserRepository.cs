using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Data;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.IRepository;

namespace SocialMediaApp.api.Repository
{
    public class UserRepository(AppDbContext db) : IUserRepository
    {
        public async Task<AppUser?> GetUserByIdAsync(int id)
        {
            return await db.Users.FindAsync(id);
        }

        public async Task<AppUser?> GetUserByUsernameAsync(string username)
        {
            return await db.Users
                .Include(tmp => tmp.Photos)
                .SingleOrDefaultAsync(tmp => tmp.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await db.Users
                .Include(tmp => tmp.Photos)
                .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await db.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            db.Entry(user).State = EntityState.Modified; //here we are telling ef core that this entity is modified
        }
    }
}
