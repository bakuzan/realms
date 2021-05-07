using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Wiki.Services;
using Wiki.ViewModels.Tag;

namespace Wiki.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TagController : WikiBaseController
    {

        private readonly ILogger<TagController> _logger;
        private ITagService _tagService;

        public TagController(ILogger<TagController> logger, ITagService tagService)
        {
            _logger = logger;
            _tagService = tagService;
        }

        [HttpGet]
        [Route("{action}")]
        public async Task<List<TagDropdownModel>> GetRealmTags()
        {
            return await _tagService.GetRealmTags(User);
        }

        [HttpGet]
        [Route("{action}/{realmCode}")]
        public async Task<List<TagDropdownModel>> GetFragmentTagsInRealm(string realmCode)
        {
            return await _tagService.GetFragmentTagsInRealm(User, realmCode);
        }

        // todo
        // get fragments for tag(s)
        // get realms for tag(s)


    }
}
