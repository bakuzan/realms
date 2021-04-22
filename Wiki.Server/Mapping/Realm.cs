using AutoMapper;
using Wiki.Data;
using Wiki.ViewModels;

namespace Wiki.Mapping
{
    public class RealmProfile : Profile
    {
        public RealmProfile()
        {
            CreateMap<Realm, RealmViewModel>()
                .ForMember(d => d.RealmOwnerUserId, s => s.MapFrom(x => x.ApplicationUserId));

            CreateMap<RealmCreateRequest, Realm>();

        }
    }
}