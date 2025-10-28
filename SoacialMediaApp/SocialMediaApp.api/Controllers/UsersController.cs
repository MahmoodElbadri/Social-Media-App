using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Data;
using SocialMediaApp.api.Entities;

namespace SocialMediaApp.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(AppDbContext _db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<AppUser>>> GetUsers()
    {
        return Ok(await _db.Users.ToListAsync());
    }
    
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {
        return Ok(await _db.Users.FirstOrDefaultAsync(x => x.ID == id));
    }
}