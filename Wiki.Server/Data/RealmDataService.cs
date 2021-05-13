using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Wiki.Data
{
    public class RealmDataService : DataService, IRealmDataService
    {
        private readonly DatabaseContext _context;

        public RealmDataService(DatabaseContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Realm>> GetRealms(string userId)
        {
            var isAuthenticated = !string.IsNullOrEmpty(userId);

            return await _context.Realms
                .Include(x => x.Fragments)
                .Where(x =>
                    (!x.IsAuthenticationRestricted && !x.IsPrivate)
                    || (!x.IsPrivate && x.IsAuthenticationRestricted && isAuthenticated)
                    || (x.IsPrivate && x.ApplicationUserId == userId))
                .ToListAsync();
        }

        public async Task<Realm> GetRealmById(int realmId)
        {
            return await _context.Realms
                .Include(x => x.Fragments)
                .Include(x => x.RealmShards).ThenInclude(x => x.RealmShardEntries)
                .Include(x => x.Tags)
                .FirstOrDefaultAsync(x => x.Id == realmId);
        }

        public async Task<Realm> GetRealmAsync(string code)
        {
            return await _context.Realms
                .Include(x => x.Fragments)
                .Include(x => x.Tags)
                .FirstOrDefaultAsync(x => x.Code == code);
        }

        public async Task<List<RealmShard>> GetRealmShardsForRealm(int realmId)
        {
            return await _context.RealmShards
                .Include(x => x.RealmShardEntries).ThenInclude(x => x.Fragment)
                .Where(x => x.RealmId == realmId)
                .ToListAsync();
        }

    }
}
