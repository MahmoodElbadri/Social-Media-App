using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;

namespace SocialMediaApp.api.IRepository;

public interface ILikeRepository
{
    Task<UserLike?> GetUserLike(int sourceUserID, int targetUserID);
    Task<IEnumerable<MemberDto>> GetUserLikes(string predicate, int userID);
    Task<IEnumerable<int>> GetCurrentUserLikeIDs(int currentUserID);
    void DeleteLike(UserLike like);
    void AddLike(UserLike like);
    Task<bool> SaveChanges();

}
