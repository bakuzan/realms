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
        public DbSet<Fragment> Fragments { get; set; }
        public DbSet<Tag> Tags { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Realm>(entity =>
            {
                entity.Property(x => x.Name)
                      .IsRequired();

                entity.HasIndex(u => u.Code)
                      .IsUnique();

                entity.HasOne(x => x.ApplicationUser)
                      .WithMany(x => x.Realms)
                      .HasForeignKey(x => x.ApplicationUserId)
                      .IsRequired();

                entity.HasMany(x => x.Tags)
                      .WithMany(x => x.Realms);
            });

            modelBuilder.Entity<Fragment>(entity =>
            {
                entity.Property(x => x.Name)
                      .IsRequired();

                entity.Property(x => x.Code)
                      .IsRequired();

                entity.HasOne(x => x.Realm)
                      .WithMany(x => x.Fragments)
                      .HasForeignKey(x => x.RealmId)
                      .IsRequired();

                entity.HasMany(x => x.Tags)
                      .WithMany(x => x.Fragments);
            });

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.Property(x => x.Name)
                      .IsRequired();

                entity.Property(x => x.Code)
                      .IsRequired();

                entity.HasMany(x => x.Realms)
                      .WithMany(x => x.Tags);

                entity.HasMany(x => x.Fragments)
                      .WithMany(x => x.Tags);
            });


        }

    }
}