using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Wiki.Data.Models;

namespace Wiki.Data
{
    public class DatabaseContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public DatabaseContext(DbContextOptions options,
                               IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        // Database entities here


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }

    }
}