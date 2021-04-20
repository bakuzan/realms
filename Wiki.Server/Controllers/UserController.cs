using Wiki.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;
using System.Threading.Tasks;
using Wiki.ViewModels;
using Microsoft.AspNetCore.Authorization;

namespace Wiki.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : WikiBaseController
    {

        private readonly ILogger<UserController> _logger;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public UserController(ILogger<UserController> logger,
                                IMapper mapper,
                                IUserService userService) : base()
        {
            _logger = logger;
            _mapper = mapper;
            _userService = userService;
        }


        [HttpGet]
        public async Task<UserViewModel> Get()
        {
            return await _userService.GetCurrentUser(User);
        }

    }
}