using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Wiki.ViewModels;

namespace Wiki.Services
{
    public interface IRealmService
    {
        Task<List<RealmViewModel>> GetRealms(ClaimsPrincipal claim);
        Task<RealmResponse> GetRealmByCode(ClaimsPrincipal claim, string code);

    }
}
