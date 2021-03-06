using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Wiki.Data;
using Wiki.Enums;
using Wiki.ViewModels.Fragment;
using Wiki.ViewModels.Realm;
using Wiki.ViewModels.Tag;

namespace Wiki.Services
{
    public class TagService : ITagService
    {
        private readonly IUserService _userService;
        private readonly ITagDataService _tagDataService;
        private readonly IRealmDataService _realmDataService;
        private readonly IMapper _mapper;

        public TagService(IUserService userService,
                          ITagDataService tagDataService,
                          IRealmDataService realmDataService,
                          IMapper mapper)
        {
            _userService = userService;
            _tagDataService = tagDataService;
            _realmDataService = realmDataService;
            _mapper = mapper;
        }

        public async Task<List<TagDropdownModel>> GetRealmTags(ClaimsPrincipal claim)
        {
            var tags = await _tagDataService
                .GetTagsForScopeQuery(TagScope.Realm)
                .OrderBy(x => x.Name)
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
                .OrderBy(x => x.Name)
                .ToListAsync();

            return _mapper.Map<List<TagDropdownModel>>(tags);
        }

        public async Task<List<TagCountedModel>> GetFragmentTagsInRealmCounted(ClaimsPrincipal claim, string realmCode)
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
                return new List<TagCountedModel>();
            }

            var tags = await _tagDataService
                .GetTagsForScopeQuery(TagScope.Fragment)
                .Include(x => x.Fragments)
                .Where(x => x.Fragments.Any(f => f.RealmId == realm.Id))
                .OrderBy(x => x.Name)
                .ToListAsync();

            return _mapper.Map<List<TagCountedModel>>(tags);
        }

        public async Task<TagRelatedEntitiesResponse> GetRealmsWithTags(ClaimsPrincipal claim, TagRelatedEntitiesRequest request)
        {
            var response = new TagRelatedEntitiesResponse();
            var user = await _userService.GetCurrentUser(claim);
            var userId = user == null ? string.Empty : user.Id;

            // Realms valid to user
            var realms = await _realmDataService.GetRealms(userId);

            // Realms for these tags
            var tagOptions = await _tagDataService
                .GetTagsForScopeQuery(TagScope.Realm)
                .Include(x => x.Realms)
                .OrderBy(x => x.Name)
                .ToListAsync();

            var tags = tagOptions
                .Where(x => request.TagCodes.Contains(x.Code))
                .ToList();

            var tagRealmIds = tags.SelectMany(x => x.Realms.Select(r => r.Id)).Distinct();
            var realmIds = tagRealmIds
                .Where(x => tags.All(t => t.Realms.Any(r => r.Id == x)))
                .ToList();

            response.Data.Tags = _mapper.Map<List<TagDropdownModel>>(tags);
            response.Data.TagOptions = _mapper.Map<List<TagDropdownModel>>(tagOptions);
            response.Data.Items = _mapper.Map<List<TagRelatedItem>>(
                realms
                    .Where(r => realmIds.Contains(r.Id))
                    .OrderBy(r => r.Name)
            );

            return response;
        }

        public async Task<TagRelatedEntitiesResponse> GetFragmentsWithTags(ClaimsPrincipal claim, TagRelatedEntitiesRequest request)
        {
            var response = new TagRelatedEntitiesResponse();
            var user = await _userService.GetCurrentUser(claim);
            var userId = user == null ? string.Empty : user.Id;

            // Fragments for a valid to realm
            var realm = await _tagDataService.GetAsync<Realm>(x => x.Code == request.RealmCode);
            if (realm == null
                || (realm.IsAuthenticationRestricted && user == null)
                || (realm.IsPrivate && realm.ApplicationUserId != userId))
            {
                response.ErrorMessages.Add("You are not permitted to access this realm.");
                return response;
            }

            // Fragments for these tags
            var tagOptions = await _tagDataService
                .GetTagsForScopeQuery(TagScope.Fragment)
                .Include(x => x.Fragments).ThenInclude(x => x.Realm)
                .Where(x => x.Fragments.Any(f => f.RealmId == realm.Id))
                .OrderBy(x => x.Name)
                .ToListAsync();

            var tags = tagOptions
                .Where(x => request.TagCodes.Contains(x.Code))
                .ToList();

            var tagFragments = tags.SelectMany(x => x.Fragments).Distinct();
            var fragments = tagFragments
                .Where(x => tags.All(t => t.Fragments.Any(f => f.Id == x.Id)))
                .ToList();

            response.Data.RealmName = realm.Name;
            response.Data.Tags = _mapper.Map<List<TagDropdownModel>>(tags);
            response.Data.TagOptions = _mapper.Map<List<TagDropdownModel>>(tagOptions);
            response.Data.Items = _mapper.Map<List<TagRelatedItem>>(fragments);

            return response;
        }

    }
}
