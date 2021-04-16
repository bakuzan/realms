using Microsoft.AspNetCore.Mvc;

namespace Wiki.Controllers
{
    [ApiController]
    public abstract class WikiBaseController : ControllerBase
    {
        protected WikiBaseController()
        { }
    }
}
