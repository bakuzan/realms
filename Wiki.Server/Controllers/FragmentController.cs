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

        // todo
        // create a fragment by code detailed endpoint
        // this will return a the fragment view with related fragments (that is not in the default fragment by code)

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
