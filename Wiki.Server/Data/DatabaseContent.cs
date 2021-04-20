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
        public DbSet<Realm> Realms { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Realm>()
                        .HasOne(x => x.ApplicationUser)
                        .WithMany(x => x.Realms)
                        .HasForeignKey(x => x.ApplicationUserId);

        }

    }
}