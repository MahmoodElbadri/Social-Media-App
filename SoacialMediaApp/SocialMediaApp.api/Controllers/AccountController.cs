using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Data;
using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.IRepository;

namespace SocialMediaApp.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(AppDbContext _db, ITokenService _tokenService,
    IMapper _mapper) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto regisDto)
    {
        if (await UserExists(regisDto.UserName))
        {
            return BadRequest("Email already exists");
        }
        var user = _mapper.Map<AppUser>(regisDto);
        using var hmac = new HMACSHA512();
        var username = regisDto.UserName.ToLower();
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(regisDto.Password!));
        user.PasswordSalt = hmac.Key;
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return new UserDto
        {
            UserName = user.UserName,
            Token = _tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender, 
        };
    }
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _db.Users
            .Include(tmp => tmp.Photos)
                .FirstOrDefaultAsync(tmp => tmp.UserName == loginDto.UserName);
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
            Token = _tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender,
            PhotoUrl = user.Photos.FirstOrDefault(tmp=>tmp.IsMain)?.Url 
        };
    }
    private async Task<bool> UserExists(string username)
    {
        return await _db.Users.AnyAsync(tmp => tmp.UserName.ToLower() == username.ToLower());
    }
}