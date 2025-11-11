using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.api.Data;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.Filters;

namespace SocialMediaApp.api.Controllers;

[ApiController]
[ServiceFilter(typeof(LogUserActivityFilter))]
[Route("api/[controller]")]
public class BuggyController(AppDbContext _db) : ControllerBase
{
    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> GetAuth()
    {
        return "Ok(\"Authorized\");";
    }

    [HttpGet("not-found")]
    public ActionResult<AppUser> GetUnAuth()
    {
        var thing = _db.Users.Find(-1);
        if (thing is not null)
        {
            return thing;
        }

        return NotFound("Not Found");
    }

    [HttpGet("server-error")]
    public ActionResult<AppUser> GetServerError()
    {
        // try
        // {
        // }
        // catch (Exception e)
        // {
        //     return StatusCode(500, "Computer says no!");
        // }
        var thing = _db.Users.Find(-1) ?? throw new Exception("Bad thing happened");
        return thing;
    }

    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest("This was not a good request");
    }
}