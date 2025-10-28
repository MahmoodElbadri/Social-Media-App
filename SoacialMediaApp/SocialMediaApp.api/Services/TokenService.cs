using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.Interfaces;

namespace SocialMediaApp.api.Services;

public class TokenService(IConfiguration config) : ITokenService
{
    public string CreateToken(AppUser user)
    {
        var tokenKey = config["JwtKey"];
        if (tokenKey.Length < 64)
        {
            throw new Exception("Invalid token key");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserName),
        };

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var token = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(1000),
            SigningCredentials = creds
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenString = tokenHandler.WriteToken(tokenHandler.CreateToken(token));
        return tokenString;
    }
}