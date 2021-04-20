using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Wiki.Data;
using Wiki.ViewModels;

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

        public async Task<List<RealmViewModel>> GetRealms(ClaimsPrincipal claim)
        {
            var user = await _userService.GetCurrentUser(claim);
            var userId = user == null ? string.Empty : user.Id;

            var realms = await _realmDataService.GetRealms(userId);

            return _mapper.Map<List<RealmViewModel>>(realms);
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
            }

            return response;
        }


    }
}
