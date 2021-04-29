using AutoMapper;
using Wiki.Data;
using Wiki.ViewModels.Tag;

namespace Wiki.Mapping
{
    public class TagProfile : Profile
    {
        public TagProfile()
        {
            CreateMap<Tag, TagViewModel>();
            CreateMap<Tag, TagDropdownModel>();

        }
    }
}