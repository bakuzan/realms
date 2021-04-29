using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Wiki.Data;
using Wiki.Extensions;
using Wiki.ViewModels.Fragment;
using Wiki.ViewModels.Tag;

namespace Wiki.Services
{
    public class FragmentService : IFragmentService
    {
        private readonly IUserService _userService;
        private readonly IFragmentDataService _fragmentDataService;
        private readonly IMapper _mapper;

        public FragmentService(IUserService userService,
                               IFragmentDataService fragmentDataService,
                               IMapper mapper)
        {
            _userService = userService;
            _fragmentDataService = fragmentDataService;
            _mapper = mapper;
        }

        public async Task<FragmentResponse> GetFragmentByCode(ClaimsPrincipal claim, string code)
        {
            var response = new FragmentResponse();

            var user = await _userService.GetCurrentUser(claim);
            var userId = user == null ? string.Empty : user.Id;

            var fragment = await _fragmentDataService.GetFragmentAsync(code);

            if (fragment == null)
            {
                response.ErrorMessages.Add($"Fragment(code: {code}) was not found.");
            }
            else if (fragment.Realm.IsAuthenticationRestricted && claim == null)
            {
                response.ErrorMessages.Add($"Fragment(code: {code}) belongs to a realm that requires you to be authenticated to view it.");
            }
            else if (fragment.Realm.IsPrivate && fragment.Realm.ApplicationUserId != userId)
            {
                response.ErrorMessages.Add($"Fragment(code: {code}) belongs to a private realm.");
            }
            else
            {
                response.Data = _mapper.Map<FragmentViewModel>(fragment);
            }

            return response;
        }

        public async Task<FragmentCreateUpdateResponse> CreateFragment(ClaimsPrincipal claim, FragmentCreateRequest request)
        {
            var response = new FragmentCreateUpdateResponse();

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

            var realm = await _fragmentDataService.GetAsync<Realm>(request.RealmId);
            if (realm == null)
            {
                response.ErrorMessages.Add("The Realm you are attempting to create a page for was not found.");
                return response;
            }

            var fragment = _mapper.Map<Fragment>(request);
            fragment.Code = await ValidateAndSetFragmentCode(fragment, realm);

            await ProcessAndPersistNewTags(realm, fragment, request.TagList);

            _fragmentDataService.SetToPersist(fragment);
            await _fragmentDataService.SaveAsync();

            response.Data = _mapper.Map<FragmentItemViewModel>(fragment);
            return response;
        }

        public async Task<FragmentCreateUpdateResponse> UpdateFragment(ClaimsPrincipal claim, FragmentUpdateRequest request)
        {
            var response = new FragmentCreateUpdateResponse();

            var user = await _userService.GetCurrentUser(claim);
            var userId = user == null ? string.Empty : user.Id;

            if (string.IsNullOrEmpty(userId))
            {
                response.ErrorMessages.Add("You are not authorised to perform this action.");
                return response;
            }

            var fragment = await _fragmentDataService.GetAsync<Fragment>(request.Id, x => x.Realm, x => x.Tags);
            if (fragment == null)
            {
                response.ErrorMessages.Add("Fragment not found.");
                return response;
            }
            else if (fragment.Realm.IsPrivate && fragment.Realm.ApplicationUserId != userId)
            {
                response.ErrorMessages.Add($"Fragment(code: {fragment.Code}) is part of a private realm.");
                return response;
            }

            _mapper.Map(request, fragment);

            if (string.IsNullOrEmpty(fragment.Name))
            {
                response.ErrorMessages.Add("Name is required.");
                return response;
            }

            // Update tags
            var oldTagIds = request.TagList
                .Where(x => x.Id.HasValue)
                .Select(x => x.Id.Value);

            var currentTags = fragment.Tags.ToList();
            foreach (var t in currentTags)
            {
                if (!oldTagIds.Contains(t.Id))
                {
                    fragment.Tags.Remove(t);
                }
            }

            await ProcessAndPersistNewTags(fragment.Realm, fragment, request.TagList);

            _fragmentDataService.SetToPersist(fragment);
            await _fragmentDataService.SaveAsync();

            response.Data = _mapper.Map<FragmentItemViewModel>(fragment);
            return response;
        }


        #region Private

        private async Task<string> ValidateAndSetFragmentCode(Fragment fragment, Realm realm)
        {
            var realmId = realm.Id;
            var code = fragment.Name.GenerateSlug();

            var matches = await _fragmentDataService.GetListAsync<Fragment>(x =>
                x.RealmId == realmId
                && (x.Code == code
                    || x.Code.StartsWith($"{code}_")));

            if (matches.Count > 0)
            {
                code += $"_{matches.Count}";
            }

            return code;
        }

        private async Task ProcessAndPersistNewTags(Realm realm, Fragment fragment, List<TagInputModel> tagList)
        {
            var relamId = realm.Id;
            var inputs = tagList.Where(x => !x.Id.HasValue
                && !string.IsNullOrEmpty(x.Name.ToLower().Trim()));

            if (!inputs.Any())
                return;

            var existingTags = await _fragmentDataService.GetListAsync<Tag>(x =>
                x.TagScope == Enums.TagScope.Fragment
                && (!x.Fragments.Any()
                    || x.Fragments.Any(f => f.RealmId == relamId)));

            foreach (var input in inputs)
            {
                var name = input.Name.ToLower().Trim();
                var code = input.Name.GenerateSlug();

                if (fragment.Tags.Any(t => t.Code == code))
                    continue;

                var tag = existingTags.FirstOrDefault(x => x.Code == code);
                if (tag == null)
                {
                    var newTag = new Tag
                    {
                        Name = name,
                        Code = code,
                        TagScope = Enums.TagScope.Fragment
                    };

                    _fragmentDataService.SetToPersist(newTag);
                    fragment.Tags.Add(newTag);
                }
                else
                {
                    fragment.Tags.Add(tag);
                }
            }
        }

        #endregion

    }
}
