using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Wiki.ViewModels.Realm;

namespace Wiki.Services
{
    public interface IRealmService
    {
        Task<List<RealmItemViewModel>> GetRealms(ClaimsPrincipal claim);
        Task<RealmResponse> GetRealmByCode(ClaimsPrincipal claim, string code);
        Task<RealmCreateResponse> CreateRealm(ClaimsPrincipal claim, RealmCreateRequest request);
        Task<RealmUpdateResponse> UpdateRealm(ClaimsPrincipal claim, RealmUpdateRequest request);

    }
}
