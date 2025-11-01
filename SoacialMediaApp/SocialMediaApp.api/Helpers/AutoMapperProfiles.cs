using AutoMapper;
using SocialMediaApp.api.Dtos;
using SocialMediaApp.api.Entities;

namespace SocialMediaApp.api.Helpers;

public class AutoMapperProfiles:Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDto>()
            .ForMember(destinationMember => destinationMember.PhotoUrl,
            option => option.MapFrom(sourceMember => sourceMember.Photos.FirstOrDefault(x => x.IsMain)!.Url));
        CreateMap<Photo, PhotoDto>();
    }
}
