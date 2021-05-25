using AutoMapper;
using Wiki.Data;
using Wiki.Enums;
using Wiki.ViewModels.Tag;

namespace Wiki.Mapping
{
    public class TagProfile : Profile
    {
        public TagProfile()
        {
            CreateMap<Tag, TagViewModel>();
            CreateMap<Tag, TagDropdownModel>();

            CreateMap<Tag, TagCountedModel>()
              .ForMember(d => d.Count, s => s.MapFrom(x => x.Fragments.Count));

            CreateMap<Realm, TagRelatedItem>()
                .ForMember(d => d.FragmentCount, s => s.MapFrom(x => x.Fragments.Count))
                .ForMember(d => d.TagScope, s => s.MapFrom(x => TagScope.Realm));

            CreateMap<Fragment, TagRelatedItem>()
                .ForMember(d => d.RealmCode, s => s.MapFrom(x => x.Realm.Code))
                .ForMember(d => d.TagScope, s => s.MapFrom(x => TagScope.Fragment));

        }
    }
}