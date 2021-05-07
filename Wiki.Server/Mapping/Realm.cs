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

            CreateMap<RealmShard, RealmShardViewModel>();

            CreateMap<RealmShardEntry, RealmShardEntryViewModel>()
                .ForMember(d => d.FragmentName, s => s.MapFrom(x => x.Fragment.Name))
                .ForMember(d => d.FragmentCode, s => s.MapFrom(x => x.Fragment.Code));

            CreateMap<Fragment, RealmShardEntryViewModel>()
                .ForMember(d => d.FragmentId, s => s.MapFrom(x => x.Id))
                .ForMember(d => d.FragmentName, s => s.MapFrom(x => x.Name))
                .ForMember(d => d.FragmentCode, s => s.MapFrom(x => x.Code));

            CreateMap<RealmCreateRequest, Realm>();
            CreateMap<RealmUpdateRequest, Realm>();

        }
    }
}