using System.ComponentModel.DataAnnotations;

namespace SocialMediaApp.api.Dtos;

public class RegisterDto
{
    [Required]
    public string? UserName { get; set; }
    [Required]
    public string? Password { get; set; }
}