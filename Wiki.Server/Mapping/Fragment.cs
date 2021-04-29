using AutoMapper;
using Wiki.Data;
using Wiki.ViewModels.Fragment;

namespace Wiki.Mapping
{
    public class FragmentProfile : Profile
    {
        public FragmentProfile()
        {
            CreateMap<Fragment, FragmentItemViewModel>();

            CreateMap<Fragment, FragmentViewModel>()
                .ForMember(d => d.RealmOwnerUserId, s => s.MapFrom(x => x.Realm.ApplicationUserId));

            CreateMap<FragmentCreateRequest, Fragment>();
            CreateMap<FragmentUpdateRequest, Fragment>();

        }
    }
}