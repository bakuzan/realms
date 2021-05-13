using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
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
                response.Data = await MapRealmAndBuildFragmentsMap(realm);
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

            var realm = await _realmDataService.GetRealmById(request.Id);

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
            ProcessAndPersistRealmShards(realm, request.Shards);

            // Save and return
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

        private async Task<RealmViewModel> MapRealmAndBuildFragmentsMap(Realm realm)
        {
            var fragmentIds = new List<int>();
            var data = _mapper.Map<RealmViewModel>(realm);

            var shards = await _realmDataService.GetRealmShardsForRealm(realm.Id);

            foreach (var shard in shards)
            {
                var group = _mapper.Map<RealmShardViewModel>(shard);
                var entries = _mapper.Map<List<RealmShardEntryViewModel>>(shard.RealmShardEntries);

                group.Entries = group.IsOrdered
                    ? entries.OrderBy(x => x.EntryOrder.Value).ToList()
                    : entries;

                fragmentIds.AddRange(entries.Select(x => x.FragmentId));
                data.Shards.Add(group);
            }

            var remainderFragments = realm.Fragments.Where(x => !fragmentIds.Contains(x.Id));

            if (remainderFragments.Any())
            {
                data.Shards.Add(
                    new RealmShardViewModel
                    {
                        Entries = _mapper.Map<List<RealmShardEntryViewModel>>(remainderFragments)
                    });
            }

            return data;
        }

        private void ProcessAndPersistRealmShards(Realm realm, List<RealmShardInputModel> shards)
        {
            var allFragments = realm.Fragments.ToList();
            var currentShards = realm.RealmShards.ToList();

            var existingShards = shards
                .Where(x => x.Id.HasValue);

            var shardIds = existingShards
                .Select(x => x.Id.Value);

            // Update or Remove shards
            foreach (var shard in currentShards)
            {
                if (shardIds.Contains(shard.Id))
                {
                    var update = existingShards.First(x => x.Id.Value == shard.Id);

                    shard.Name = update.Name; // todo protect against empty names
                    shard.IsOrdered = update.IsOrdered;

                    var shardFragmentIds = update.EntryList.Select(x => x.FragmentId).ToList();
                    var entryOrder = 0;

                    foreach (var frag in shard.RealmShardEntries)
                    {
                        if (shardFragmentIds.Contains(frag.FragmentId))
                        {
                            frag.EntryOrder = shard.IsOrdered
                                ? shardFragmentIds.IndexOf(frag.FragmentId)
                                : null;

                            entryOrder++;
                            _realmDataService.SetToPersist(frag);
                        }
                        else
                        {
                            shard.RealmShardEntries.Remove(frag);
                            _realmDataService.Delete(frag);
                        }
                    }

                    var newFragments = update.EntryList.Where(x =>
                        !shard.RealmShardEntries.Any(s => s.FragmentId == x.FragmentId));

                    foreach (var inputFrag in newFragments)
                    {
                        var newFragEntry = new RealmShardEntry
                        {
                            EntryOrder = shard.IsOrdered ? entryOrder++ : null,
                            FragmentId = inputFrag.FragmentId
                        };

                        _realmDataService.SetToPersist(newFragEntry);
                        shard.RealmShardEntries.Add(newFragEntry);
                    }

                    _realmDataService.SetToPersist(shard);
                }
                else
                {
                    realm.RealmShards.Remove(shard);
                    _realmDataService.Delete(shard);
                }
            }

            var newShards = shards.Where(x => !x.Id.HasValue);

            // Add shards
            foreach (var input in newShards)
            {
                var newRealmShard = new RealmShard
                {
                    Name = input.Name, // todo protect against empty names
                    IsOrdered = input.IsOrdered,
                    RealmId = realm.Id
                };

                ValidateAndSetRealmShardCode(realm, newRealmShard);

                var entryOrder = 0;
                foreach (var frag in input.EntryList)
                {
                    var entry = new RealmShardEntry
                    {
                        EntryOrder = newRealmShard.IsOrdered ? entryOrder++ : null,
                        FragmentId = frag.FragmentId,
                    };

                    _realmDataService.SetToPersist(entry);
                    newRealmShard.RealmShardEntries.Add(entry);
                }

                _realmDataService.SetToPersist(newRealmShard);
                realm.RealmShards.Add(newRealmShard);
            }

        }

        private void ValidateAndSetRealmShardCode(Realm realm, RealmShard shard)
        {
            var code = shard.Name.GenerateSlug();
            var matches = realm.RealmShards
                .Where(x =>
                    x.Code == code
                    || x.Code.StartsWith($"{code}_"))
                .ToList();

            if (matches.Count > 0)
            {
                code += $"_{matches.Count}";
            }

            shard.Code = code;
        }

        #endregion

    }
}
