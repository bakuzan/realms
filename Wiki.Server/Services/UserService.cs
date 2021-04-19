using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Wiki.Data.Models;
using Wiki.ViewModels;
using Microsoft.AspNetCore.Identity;

namespace Wiki.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IMapper _mapper;

        public UserService(IMapper mapper,
                           UserManager<ApplicationUser> userManager,
                           SignInManager<ApplicationUser> signInManager)
        {
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<UserModel> GetCurrentUser(ClaimsPrincipal claim)
        {
            var userId = claim.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(userId);
            var model = _mapper.Map<UserModel>(user);

            return model;
        }
    }
}
