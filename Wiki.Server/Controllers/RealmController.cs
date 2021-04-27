using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Wiki.Services;
using Wiki.ViewModels;

namespace Wiki.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RealmController : WikiBaseController
    {

        private readonly ILogger<RealmController> _logger;
        private IRealmService _realmService;

        public RealmController(ILogger<RealmController> logger, IRealmService realmService)
        {
            _logger = logger;
            _realmService = realmService;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<RealmItemViewModel>> GetAll()
        {
            return await _realmService.GetRealms(User);
        }

        [HttpGet]
        [Route("{code}")]
        public async Task<RealmResponse> Get(string code)
        {
            return await _realmService.GetRealmByCode(User, code);
        }

        [Authorize]
        [HttpPost]
        [Route("create")]
        public async Task<RealmCreateResponse> Create(RealmCreateRequest request)
        {
            return await _realmService.CreateRealm(User, request);
        }

        [Authorize]
        [HttpPost]
        [Route("update")]
        public async Task<RealmUpdateResponse> Update(RealmUpdateRequest request)
        {
            return await _realmService.UpdateRealm(User, request);
        }

    }
}
