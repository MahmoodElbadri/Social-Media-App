using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Data;
using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.IRepository;

namespace SocialMediaApp.api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController(IUserRepository _userRepo, IMapper _mapper) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<MemberDto>>> GetUsers()
    {
        var users = await _userRepo.GetUsersAsync();
        return Ok(_mapper.Map<List<MemberDto>>(users));
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<AppUser>> GetUser(string username)
    {
        var user = await _userRepo.GetUserByUsernameAsync(username);
        if(user == null) return NotFound();
        return Ok(_mapper.Map<MemberDto>(user));
    }
}