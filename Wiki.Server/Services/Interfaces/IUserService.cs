using System.Security.Claims;
using System.Threading.Tasks;
using Wiki.ViewModels;

namespace Wiki.Services
{
    public interface IUserService
    {
        Task<UserViewModel> GetCurrentUser(ClaimsPrincipal claim);
    }
}
