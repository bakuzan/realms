using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Wiki.ViewModels;

namespace Wiki.Services
{
    public interface ITagService
    {
        Task<List<TagDropdownModel>> GetRealmTags(ClaimsPrincipal claim);

    }
}