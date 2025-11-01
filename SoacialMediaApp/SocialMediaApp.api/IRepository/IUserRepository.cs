using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;

namespace SocialMediaApp.api.IRepository;

public interface IUserRepository
{
    void Update(AppUser user);
    Task<bool> SaveAllAsync();
    Task<AppUser?> GetUserByIdAsync(int id);
    Task<AppUser?> GetUserByUsernameAsync(string username);
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<IEnumerable<MemberDto>> GetMembersAsync();
    Task<MemberDto?> GetMemberAsync(string username);
}
