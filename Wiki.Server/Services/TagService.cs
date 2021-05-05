using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Wiki.Data;
using Wiki.Enums;
using Wiki.ViewModels.Tag;

namespace Wiki.Services
{
    public class TagService : ITagService
    {
        private readonly IUserService _userService;
        private readonly ITagDataService _tagDataService;
        private readonly IMapper _mapper;

        public TagService(IUserService userService,
                          ITagDataService tagDataService,
                          IMapper mapper)
        {
            _userService = userService;
            _tagDataService = tagDataService;
            _mapper = mapper;
        }

        public async Task<List<TagDropdownModel>> GetRealmTags(ClaimsPrincipal claim)
        {
            var tags = await _tagDataService
                .GetTagsForScopeQuery(TagScope.Realm)
                .ToListAsync();

            return _mapper.Map<List<TagDropdownModel>>(tags);
        }

        public async Task<List<TagDropdownModel>> GetFragmentTagsInRealm(ClaimsPrincipal claim, string realmCode)
        {
            var user = await _userService.GetCurrentUser(claim);
            var userId = user == null ? string.Empty : user.Id;

            var realm = await _tagDataService.GetAsync<Realm>(x => x.Code == realmCode);
            if (realm == null
                || (realm.IsAuthenticationRestricted && user == null)
                || (realm.IsPrivate && realm.ApplicationUserId != userId))
            {
                // Todo properly...
                // For now just give invalid users nothing.
                return new List<TagDropdownModel>();
            }

            var tags = await _tagDataService
                .GetTagsForScopeQuery(TagScope.Fragment)
                .Where(x => x.Fragments.Any(f => f.RealmId == realm.Id))
                .ToListAsync();

            return _mapper.Map<List<TagDropdownModel>>(tags);
        }


    }
}
