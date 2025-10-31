using System.ComponentModel.DataAnnotations;

namespace SocialMediaApp.api.Dtos;

public class RegisterDto
{
    [Required]
    public string? UserName { get; set; }
    [Required]
    [StringLength(8, MinimumLength = 4)]
    public string? Password { get; set; }
}