using AutoMapper;
using Wiki.Data;
using Wiki.ViewModels.Realm;

namespace Wiki.Mapping
{
    public class RealmProfile : Profile
    {
        public RealmProfile()
        {
            CreateMap<Realm, RealmItemViewModel>()
                .ForMember(d => d.FragmentCount, s => s.MapFrom(x => x.Fragments.Count));

            CreateMap<Realm, RealmViewModel>()
                .ForMember(d => d.RealmOwnerUserId, s => s.MapFrom(x => x.ApplicationUserId));

            CreateMap<RealmCreateRequest, Realm>();
            CreateMap<RealmUpdateRequest, Realm>();

        }
    }
}