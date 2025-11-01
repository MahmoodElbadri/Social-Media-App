using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Data;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.IRepository;

namespace SocialMediaApp.api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController(IUserRepository _userRepo) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<AppUser>>> GetUsers()
    {
        return Ok(await _userRepo.GetUsersAsync());
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<AppUser>> GetUser(string username)
    {
        var user = await _userRepo.GetUserByUsernameAsync(username);
        return (user is null) ? NotFound() : Ok(user);
    }
}