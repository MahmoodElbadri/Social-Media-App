using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Data;
using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.Helpers;
using SocialMediaApp.api.IRepository;

namespace SocialMediaApp.api.Repository
{
    public class UserRepository(AppDbContext db, IMapper mapper) : IUserRepository
    {
        public async Task<MemberDto?> GetMemberAsync(string username)
        {
            return await db.Users
                .Where(tmp => tmp.UserName == username)
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query =  db.Users.AsQueryable();
            query = query.Where(tmp => tmp.UserName != userParams.CurrentUsername);
            if (userParams.Gender != null)
            {
                query = query.Where(tmp=>tmp.Gender == userParams.Gender);
            }

            var minAge = DateOnly.FromDateTime(DateTime.Now.AddYears(-userParams.MaxAge - 1));
            var maxAge = DateOnly.FromDateTime(DateTime.Now.AddYears(-userParams.MinAge));

            query = query.Where(tmp=>tmp.DateOfBirth >=  minAge && tmp.DateOfBirth <= maxAge);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderBy(tmp => tmp.Created),
                _ => query.OrderBy(tmp => tmp.LastActive),
            };

            return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(mapper.ConfigurationProvider),
                userParams.PageNumber, 
                userParams.PageSize);
        }

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
