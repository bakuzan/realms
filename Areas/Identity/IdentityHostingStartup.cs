using Microsoft.AspNetCore.Hosting;

[assembly: HostingStartup(typeof(Wiki.Areas.Identity.IdentityHostingStartup))]
namespace Wiki.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) =>
            {
            });
        }
    }
}