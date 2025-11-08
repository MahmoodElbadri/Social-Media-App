using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.IRepository;
using System.Security.Claims;

namespace SocialMediaApp.api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController(IUserRepository _userRepo, IMapper _mapper, IPhotoService _photoService) : ControllerBase
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

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (username == null) return BadRequest("No username found in token");
        var user = await _userRepo.GetUserByUsernameAsync(username);
        if (user == null) return BadRequest("User not found");
        var result = await _photoService.AddPhotoAsync(file);
        if (result.Error != null)
        {
            return BadRequest(result.Error.Message);
        }
        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };
        if (user.Photos.Count == 0)
        {
            photo.IsMain = true;
        }
        user.Photos.Add(photo);
        if (await _userRepo.SaveAllAsync())
        {
            return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
        }
        return BadRequest("Problem adding photo");
    }

    [HttpPut("set-main-photo/{photoId:int}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (username == null) return BadRequest("No username found in token");

        var user = await _userRepo.GetUserByUsernameAsync(username);
        if (user == null) return BadRequest("User not found");

        var photo = user.Photos.FirstOrDefault(tmp => tmp.Id == photoId);
        if (photo == null || photo.IsMain) return BadRequest("This is already your main photo");
        var currentMain = user.Photos.FirstOrDefault(tmp => tmp.IsMain);
        if (currentMain != null)
            currentMain.IsMain = false;
        photo.IsMain = true;
        if (await _userRepo.SaveAllAsync()) return NoContent();
        return BadRequest("Failed to set main photo");
    }
}