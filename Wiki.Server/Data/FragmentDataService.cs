using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Wiki.Data
{
    public class FragmentDataService : DataService, IFragmentDataService
    {
        private readonly DatabaseContext _context;

        public FragmentDataService(DatabaseContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Fragment> GetFragmentAsync(string code)
        {
            return await _context.Fragments
                .Include(x => x.Realm)
                .Include(x => x.Tags)
                .FirstOrDefaultAsync(x => x.Code == code);
        }

        public async Task<List<Fragment>> GetFragmentsForRealm(int realmId)
        {
            return await _context.Fragments
                .Where(x => x.RealmId == realmId)
                .ToListAsync();
        }

        public async Task<List<RealmShard>> GetOrderedShardsFragmentBelongsTo(int fragmentId)
        {
            return await _context.RealmShards
                .Include(x => x.RealmShardEntries).ThenInclude(x => x.Fragment)
                .Include(x => x.Realm)
                .Where(x =>
                    x.RealmShardEntries.Any(s => s.FragmentId == fragmentId)
                    && x.IsOrdered)
                .ToListAsync();
        }

    }
}
