using AutoMapper;
using Wiki.Data.Models;
using Wiki.ViewModels;

namespace Wiki.Mapping
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<ApplicationUser, UserViewModel>();
        }
    }
}