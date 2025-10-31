using System.Text.Json;
using SocialMediaApp.api.Errors;

namespace SocialMediaApp.api.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,
    IHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 500;
            var response = env.IsDevelopment()
                ? new ApiException(context.Response.StatusCode, e.Message, e.StackTrace?.ToString())
                : new ApiException(context.Response.StatusCode, "Internal Server Error");

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
             var json = JsonSerializer.Serialize(response, options);
             await context.Response.WriteAsync(json);
        }
    }
}