using AutoMapper;
using Wiki.Data;
using Wiki.ViewModels;

namespace Wiki.Mapping
{
    public class TagProfile : Profile
    {
        public TagProfile()
        {
            CreateMap<Tag, TagViewModel>();

        }
    }
}