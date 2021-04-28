using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Wiki.Data;
using Wiki.Enums;
using Wiki.ViewModels;

namespace Wiki.Services
{
    public class TagService : ITagService
    {
        private readonly IUserService _userService;
        private readonly ITagDataService _tagDataService;
        private readonly IMapper _mapper;

        public TagService(IUserService userService,
                          ITagDataService tagDataService,
                          IMapper mapper)
        {
            _userService = userService;
            _tagDataService = tagDataService;
            _mapper = mapper;
        }

        public async Task<List<TagDropdownModel>> GetRealmTags(ClaimsPrincipal claim)
        {
            var tags = await _tagDataService
                .GetTagsForScopeQuery(TagScope.Realm)
                .ToListAsync();

            return _mapper.Map<List<TagDropdownModel>>(tags);
        }


    }
}
