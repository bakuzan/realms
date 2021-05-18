using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Wiki.Services;
using Wiki.ViewModels.Fragment;

namespace Wiki.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FragmentController : WikiBaseController
    {

        private readonly ILogger<RealmController> _logger;
        private IFragmentService _fragmentService;

        public FragmentController(ILogger<RealmController> logger,
                                  IFragmentService fragmentService)
        {
            _logger = logger;
            _fragmentService = fragmentService;
        }

        [HttpGet]
        [Route("{code}")]
        public async Task<FragmentResponse> Get(string code)
        {
            return await _fragmentService.GetFragmentByCode(User, code);
        }

        [HttpGet]
        [Route("{code}/detail")]
        public async Task<FragmentDetailResponse> GetDetail(string code)
        {
            return await _fragmentService.GetFragmentDetail(User, code);
        }

        [Authorize]
        [HttpPost]
        [Route("create")]
        public async Task<FragmentCreateUpdateResponse> Create(FragmentCreateRequest request)
        {
            return await _fragmentService.CreateFragment(User, request);
        }

        [Authorize]
        [HttpPost]
        [Route("update")]
        public async Task<FragmentCreateUpdateResponse> Update(FragmentUpdateRequest request)
        {
            return await _fragmentService.UpdateFragment(User, request);
        }

    }
}
