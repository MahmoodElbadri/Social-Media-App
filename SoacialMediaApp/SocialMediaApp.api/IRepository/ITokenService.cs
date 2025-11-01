using SocialMediaApp.api.Entities;

namespace SocialMediaApp.api.IRepository;

public interface ITokenService
{
    string CreateToken(AppUser user);
}