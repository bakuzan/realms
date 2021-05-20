using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Wiki.Services;
using Wiki.ViewModels.Fragment;
using Wiki.ViewModels.Realm;
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

        [HttpPost]
        [Route("{action}")]
        public async Task<TagRelatedEntitiesResponse> GetRealmsWithTags(TagRelatedEntitiesRequest request)
        {
            return await _tagService.GetRealmsWithTags(User, request);
        }

        [HttpPost]
        [Route("{action}")]
        public async Task<TagRelatedEntitiesResponse> GetFragmentsWithTags(TagRelatedEntitiesRequest request)
        {
            return await _tagService.GetFragmentsWithTags(User, request);
        }


    }
}
