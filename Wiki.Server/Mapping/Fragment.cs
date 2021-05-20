using AutoMapper;
using Wiki.Data;
using Wiki.ViewModels.Fragment;

namespace Wiki.Mapping
{
    public class FragmentProfile : Profile
    {
        public FragmentProfile()
        {
            CreateMap<Fragment, FragmentItemViewModel>()
                .ForMember(d => d.RealmCode, s => s.MapFrom(x => x.Realm.Code));

            CreateMap<Fragment, FragmentViewModel>()
                .ForMember(d => d.RealmOwnerUserId, s => s.MapFrom(x => x.Realm.ApplicationUserId));

            CreateMap<Fragment, FragmentDetailViewModel>()
                .ForMember(d => d.RealmOwnerUserId, s => s.MapFrom(x => x.Realm.ApplicationUserId));

            CreateMap<RealmShardEntry, FragmentRelationViewModel>()
                .ForMember(d => d.Id, s => s.MapFrom(x => x.Fragment.Id))
                .ForMember(d => d.Code, s => s.MapFrom(x => x.Fragment.Code))
                .ForMember(d => d.Name, s => s.MapFrom(x => x.Fragment.Name))
                .ForMember(d => d.RealmCode, s => s.MapFrom(x => x.RealmShard.Realm.Code))
                .ForMember(d => d.ShardCode, s => s.MapFrom(x => x.RealmShard.Code))
                .ForMember(d => d.ShardName, s => s.MapFrom(x => x.RealmShard.Name));

            CreateMap<FragmentCreateRequest, Fragment>();
            CreateMap<FragmentUpdateRequest, Fragment>();

        }
    }
}