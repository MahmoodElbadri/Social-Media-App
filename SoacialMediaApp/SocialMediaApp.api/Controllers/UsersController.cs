using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Data;
using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.IRepository;
using System.Security.Claims;

namespace SocialMediaApp.api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController(IUserRepository _userRepo, IMapper _mapper) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<MemberDto>>> GetUsers()
    {
        var users = await _userRepo.GetMembersAsync();
        return Ok(users);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<AppUser>> GetUser(string username)
    {
        var user = await _userRepo.GetMemberAsync(username);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (username == null) return BadRequest("No username found in token");
        var user = await _userRepo.GetUserByUsernameAsync(username);
        if (user == null) return BadRequest("User not found");
        _mapper.Map(memberUpdateDto, user);
        if (await _userRepo.SaveAllAsync())
        {
            return NoContent();
        }
        return BadRequest("Failed to update user");
    }
}