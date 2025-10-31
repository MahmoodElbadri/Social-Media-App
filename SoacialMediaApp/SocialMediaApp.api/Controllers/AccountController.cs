using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Data;
using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.Interfaces;

namespace SocialMediaApp.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(AppDbContext _db, ITokenService _tokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto regisDto)
    {
        if (await UserExists(regisDto.UserName))
        {
            return BadRequest("Email already exists");
        }

        using var hmac = new HMACSHA512();
        var user = new AppUser
        {
            UserName = regisDto.UserName,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(regisDto.Password)),
            PasswordSalt = hmac.Key
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
         return new UserDto
        {
            UserName =  user.UserName,
            Token = _tokenService.CreateToken(user)
        };
    }
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(tmp => tmp.UserName == loginDto.UserName);
        if (user == null)
        {
            return BadRequest("Invalid username or password");
        }

        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password!));
        for (int i = 0; i < user.PasswordHash.Length; i++)
        {
            if (user.PasswordHash[i] != computedHash[i])
            {
                return BadRequest("Invalid username or password");
            }
        }

        return new UserDto
        {
            UserName = user.UserName,
            Token = _tokenService.CreateToken(user)
        };
    }
    private async Task<bool> UserExists(string username)
    {
        return await _db.Users.AnyAsync(tmp => tmp.UserName.ToLower() == username.ToLower());
    }
}