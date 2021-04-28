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


    }
}