using System.Collections.Generic;
using System.Threading.Tasks;
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
        public async Task<IEnumerable<RealmViewModel>> GetAll()
        {
            return await _realmService.GetRealms(User);
        }

        [HttpGet]
        [Route("{code}")]
        public async Task<RealmResponse> Get(string code)
        {
            return await _realmService.GetRealmByCode(User, code);
        }


    }
}
