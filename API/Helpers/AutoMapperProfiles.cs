using API.DTO;
using API.Entities;
using API.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc.TagHelpers;

namespace API.Helpers
{
    //profile is from automappers.
    public class AutoMapperProfiles:Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
            //taking url from photos to photousrl inside MembersDto
            .ForMember(dest=>dest.PhotoUrl, opt=>opt.MapFrom(src=>src.Photos.FirstOrDefault(x=>x.IsMain).Url))
            //directly call calculateage. if i dont then mapper needs full GetAge method 
            //to calculate age which will not clean the query(removing password )
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>(); 
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
            .ForMember(d=>d.SenderPhotoUrl, o=>o.MapFrom(s=>s.Sender.Photos.
                FirstOrDefault(x=>x.IsMain).Url))
            .ForMember(d=>d.RecipientPhotoUrl, o=>o.MapFrom(s=>s.Recipient.Photos.
                FirstOrDefault(x=>x.IsMain).Url))
            //photoUrl is not there in messages so we need to do additional mapping
            
            
            ;
        }
    }
}