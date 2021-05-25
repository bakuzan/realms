using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Wiki.ViewModels.Tag;

namespace Wiki.Services
{
    public interface ITagService
    {
        Task<List<TagDropdownModel>> GetRealmTags(ClaimsPrincipal claim);
        Task<List<TagDropdownModel>> GetFragmentTagsInRealm(ClaimsPrincipal claim, string realmCode);
        Task<List<TagCountedModel>> GetFragmentTagsInRealmCounted(ClaimsPrincipal claim, string realmCode);
        Task<TagRelatedEntitiesResponse> GetRealmsWithTags(ClaimsPrincipal claim, TagRelatedEntitiesRequest request);
        Task<TagRelatedEntitiesResponse> GetFragmentsWithTags(ClaimsPrincipal claim, TagRelatedEntitiesRequest request);

    }
}
