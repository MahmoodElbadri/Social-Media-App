using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.api.Data;
using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;
using SocialMediaApp.api.IRepository;

namespace SocialMediaApp.api.Repository;

public class LikeRepository(AppDbContext db, IMapper mapper) : ILikeRepository
{

    public void AddLike(UserLike like)
    {
        db.Likes.Add(like);
    }

    public void DeleteLike(UserLike like)
    {
        db.Likes.Remove(like);
    }

    public async Task<IEnumerable<int>> GetCurrentUserLikeIDs(int currentUserID)
    {
       return await db.Likes
            .Where(tmp => tmp.SourceUserID == currentUserID)
            .Select(tmp => tmp.TargetUserID)
            .ToListAsync();
    }


    public async Task<UserLike?> GetUserLike(int soureceUserID, int targetUserID)
    {
        return await db.Likes.FindAsync(soureceUserID, targetUserID);
    }

    public async Task<IEnumerable<MemberDto>> GetUserLikes(string predicate, int userID)
    {
        var likes = db.Likes.AsQueryable();
        switch (predicate)
        {
            case "liked":
                return await likes.
                    Where(tmp => tmp.SourceUserID == userID)
                    .Select(tmp => tmp.TargetUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                    .ToListAsync();
                break;
            case "likedBy":
                return await likes.
                    Where(tmp => tmp.TargetUserID == userID)
                    .Select(tmp => tmp.SourceUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                    .ToListAsync();
            default:
                var likeIDs = await GetCurrentUserLikeIDs(userID);

                return await likes
                    .Where(tmp => tmp.TargetUserID == userID && likeIDs.Contains(tmp.SourceUserID))
                    .Select(tmp => tmp.SourceUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                    .ToListAsync();
        }
    }

    public Task<IEnumerable<MemberDto>> GetUserLikesAsync(string predicate, int userID)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> SaveChanges()
    {
       return await db.SaveChangesAsync() > 0;
    }
}
