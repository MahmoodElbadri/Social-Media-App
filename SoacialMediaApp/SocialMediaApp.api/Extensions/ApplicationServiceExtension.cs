using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SocialMediaApp.api.Data;
using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.Interfaces;
using SocialMediaApp.api.Services;

namespace SocialMediaApp.api.Extensions;

public static class ApplicationServiceExtension
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
    {
        
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
        });
        services.AddScoped<ITokenService, TokenService>();
        services.AddCors();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                var tokenKey = config["JwtKey"] ?? throw new Exception("JwtKey not found from program.cs");
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
        return services;
    }
}