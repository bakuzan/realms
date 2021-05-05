using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Wiki.Data;
using Wiki.Extensions;
using Wiki.ViewModels.Realm;
using Wiki.ViewModels.Tag;

namespace Wiki.Services
{
    public class RealmService : IRealmService
    {
        private readonly IUserService _userService;
        private readonly IRealmDataService _realmDataService;
        private readonly IMapper _mapper;

        public RealmService(IUserService userService,
                            IRealmDataService realmDataService,
                            IMapper mapper)
        {
            _userService = userService;
            _realmDataService = realmDataService;
            _mapper = mapper;
        }

        public async Task<List<RealmItemViewModel>> GetRealms(ClaimsPrincipal claim)
        {
            var user = await _userService.GetCurrentUser(claim);
            var userId = user == null ? string.Empty : user.Id;

            var realms = await _realmDataService.GetRealms(userId);

            return _mapper.Map<List<RealmItemViewModel>>(realms);
        }

        public async Task<RealmResponse> GetRealmByCode(ClaimsPrincipal claim, string code)
        {
            var response = new RealmResponse();

            var user = await _userService.GetCurrentUser(claim);
            var userId = user == null ? string.Empty : user.Id;

            var realm = await _realmDataService.GetRealmAsync(code);

            if (realm == null)
            {
                response.ErrorMessages.Add($"Realm(code: {code}) was not found.");
            }
            else if (realm.IsAuthenticationRestricted && claim == null)
            {
                response.ErrorMessages.Add($"Realm(code: {code}) requires you to be authenticated to view it.");
            }
            else if (realm.IsPrivate && realm.ApplicationUserId != userId)
            {
                response.ErrorMessages.Add($"Realm(code: {code}) is a private realm.");
            }
            else
            {
                response.Data = _mapper.Map<RealmViewModel>(realm);

                // todo
                // return the fragments groupings.
            }

            return response;
        }

        public async Task<RealmCreateResponse> CreateRealm(ClaimsPrincipal claim, RealmCreateRequest request)
        {
            var response = new RealmCreateResponse();
            var user = await _userService.GetCurrentUser(claim);
            var userId = user == null ? string.Empty : user.Id;

            if (string.IsNullOrEmpty(userId))
            {
                response.ErrorMessages.Add("You are not authorised to perform this action.");
                return response;
            }

            if (string.IsNullOrEmpty(request.Name))
            {
                response.ErrorMessages.Add("Name is required.");
                return response;
            }

            var realm = _mapper.Map<Realm>(request);
            realm.ApplicationUserId = user.Id;
            realm.Code = await ValidateAndSetRealmCode(realm);

            _realmDataService.SetToPersist(realm);
            await _realmDataService.SaveAsync();

            response.Data = _mapper.Map<RealmItemViewModel>(realm);
            return response;
        }

        public async Task<RealmUpdateResponse> UpdateRealm(ClaimsPrincipal claim, RealmUpdateRequest request)
        {
            var response = new RealmUpdateResponse();
            var user = await _userService.GetCurrentUser(claim);
            var userId = user == null ? string.Empty : user.Id;

            if (string.IsNullOrEmpty(userId))
            {
                response.ErrorMessages.Add("You are not authorised to perform this action.");
                return response;
            }

            var realm = await _realmDataService.GetAsync<Realm>(request.Id, x => x.Tags);
            if (realm == null)
            {
                response.ErrorMessages.Add("Realm not found.");
                return response;
            }
            else if (realm.IsPrivate && realm.ApplicationUserId != userId)
            {
                response.ErrorMessages.Add($"Realm(code: {realm.Code}) is a private realm.");
                return response;
            }

            _mapper.Map(request, realm);

            if (string.IsNullOrEmpty(realm.Name))
            {
                response.ErrorMessages.Add("Name is required.");
                return response;
            }

            // Update tags
            var oldTagIds = request.TagList
                .Where(x => x.Id.HasValue)
                .Select(x => x.Id.Value);

            var currentTags = realm.Tags.ToList();
            foreach (var t in currentTags)
            {
                if (!oldTagIds.Contains(t.Id))
                {
                    realm.Tags.Remove(t);
                }
            }

            await ProcessAndPersistNewTags(realm, request.TagList);

            _realmDataService.SetToPersist(realm);
            await _realmDataService.SaveAsync();

            response.Data = _mapper.Map<RealmItemViewModel>(realm);
            return response;
        }


        #region Private

        private async Task<string> ValidateAndSetRealmCode(Realm realm)
        {
            var code = realm.Name.GenerateSlug();
            var matches = await _realmDataService.GetListAsync<Realm>(x =>
                x.Code == code
                || x.Code.StartsWith($"{code}_"));

            if (matches.Count > 0)
            {
                code += $"_{matches.Count}";
            }

            return code;
        }

        private async Task ProcessAndPersistNewTags(Realm realm, List<TagInputModel> tagList)
        {
            var inputs = tagList.Where(x => !x.Id.HasValue
                && !string.IsNullOrEmpty(x.Name.ToLower().Trim()));

            if (!inputs.Any())
                return;

            var existingTags = await _realmDataService.GetListAsync<Tag>(x =>
                x.TagScope == Enums.TagScope.Realm);

            foreach (var input in inputs)
            {
                var name = input.Name.ToLower().Trim();
                var code = input.Name.GenerateSlug();

                if (realm.Tags.Any(t => t.Code == code))
                    continue;

                var tag = existingTags.FirstOrDefault(x => x.Code == code);
                if (tag == null)
                {
                    var newTag = new Tag
                    {
                        Name = name,
                        Code = code,
                        TagScope = Enums.TagScope.Realm
                    };

                    _realmDataService.SetToPersist(newTag);
                    realm.Tags.Add(newTag);
                }
                else
                {
                    realm.Tags.Add(tag);
                }
            }
        }

        #endregion

    }
}
