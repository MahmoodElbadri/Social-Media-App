using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.Filters;
using SocialMediaApp.api.IRepository;
using System.Security.Claims;

namespace SocialMediaApp.api.Controllers;

[Route("api/[controller]")]
[ServiceFilter(typeof(LogUserActivityFilter))]
[ApiController]
public class LikesController(ILikeRepository _likeRepo, IUserRepository _userRepository) : ControllerBase
{
    [HttpPost("{targetUserID:int}")]
    public async Task<ActionResult> ToggleLike(int targetUserID)
    {
        // 1. Get current user's username from claims
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(username))
        {
            // It's better to be explicit that the user isn't authenticated
            return Unauthorized("User is not authenticated.");
        }

        // 2. Get the full user object for the currently logged-in user
        var currentUser = await _userRepository.GetUserByUsernameAsync(username);
        if (currentUser == null)
        {
            // This case might indicate a data consistency issue, but Unauthorized is appropriate
            return Unauthorized("Authenticated user not found in the database.");
        }

        // 3. Prevent self-liking
        if (currentUser.ID == targetUserID)
        {
            return BadRequest("You can't like yourself.");
        }

        // 4. Check if the target user exists (important validation)
        var targetUser = await _userRepository.GetUserByIdAsync(targetUserID);
        if (targetUser == null)
        {
            return NotFound("The user you are trying to like does not exist.");
        }

        // 5. Check if a like already exists
        var existingLike = await _likeRepo.GetUserLike(currentUser.ID, targetUserID);

        // --- LOGIC CORRECTION ---
        if (existingLike == null)
        {
            // If it doesn't exist, create and add a new like
            var newLike = new UserLike
            {
                SourceUserID = currentUser.ID,
                TargetUserID = targetUserID,
            };
            _likeRepo.AddLike(newLike); // Add the *new* like object
        }
        else
        {
            // If it *does* exist, delete the existing one
            _likeRepo.DeleteLike(existingLike); // Delete the *existing* like object
        }
        // --- END LOGIC CORRECTION ---

        // 6. Save changes and return the result
        if (await _likeRepo.SaveChanges())
        {
            return Ok(); // Success in either adding or deleting
        }

        // If SaveChanges returns false, it means the operation failed at the database level
        return BadRequest("Failed to update like status.");
    }



    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIDs()
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized(); 
        }

        var user = await _userRepository.GetUserByUsernameAsync(username);

        if (user == null)
        {
            return NotFound("User not found."); 
        }

        var likedIds = await _likeRepo.GetCurrentUserLikeIDs(user.ID);
        return Ok(likedIds);
    }

    [HttpGet]
    public async Task <ActionResult<IEnumerable<MemberDto>>> GetUserLikes(string predicate)
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized();
        }
        var user = await _userRepository.GetUserByUsernameAsync(username);
        var users = await _likeRepo.GetUserLikes(predicate, user.ID);
        return Ok(users);
    }
}