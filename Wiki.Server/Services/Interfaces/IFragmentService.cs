using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Wiki.ViewModels;
using Wiki.ViewModels.Fragment;

namespace Wiki.Services
{
    public interface IFragmentService
    {
        Task<FragmentResponse> GetFragmentByCode(ClaimsPrincipal claim, string code);
        Task<FragmentDetailResponse> GetFragmentDetail(ClaimsPrincipal claim, string code);
        Task<FragmentCreateUpdateResponse> CreateFragment(ClaimsPrincipal claim, FragmentCreateRequest request);
        Task<FragmentCreateUpdateResponse> UpdateFragment(ClaimsPrincipal claim, FragmentUpdateRequest request);

    }
}
