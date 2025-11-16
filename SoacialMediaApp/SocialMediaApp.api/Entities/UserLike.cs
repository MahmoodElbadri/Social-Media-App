namespace SocialMediaApp.api.Entities;

public class UserLike
{
    public AppUser SourceUser { get; set; } = null!;
    public int SourceUserID { get; set; }
    public AppUser TargetUser { get; set; } = null!;
    public int TargetUserID { get; set; }
}
