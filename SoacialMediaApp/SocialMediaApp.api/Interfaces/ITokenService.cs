using SocialMediaApp.api.Entities;

namespace SocialMediaApp.api.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUser user);
}