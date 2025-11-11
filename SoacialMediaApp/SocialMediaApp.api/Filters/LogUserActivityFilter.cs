using Microsoft.AspNetCore.Mvc.Filters;
using SocialMediaApp.api.Helpers;
using SocialMediaApp.api.IRepository;
using System.Security.Claims;

namespace SocialMediaApp.api.Filters;

public class LogUserActivityFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var result = await next();
        if (context.HttpContext.User.Identity?.IsAuthenticated != true)
        {
            return;
        }
        var username = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var repo = result.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
        var user = await repo.GetUserByUsernameAsync(username);
        if (user == null)
        {
            return;
        }
        user.LastActive = DateTime.UtcNow;
        await repo.SaveAllAsync();
    }
}
