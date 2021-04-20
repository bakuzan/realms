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
                .Where(x =>
                    (!x.IsAuthenticationRestricted && !x.IsPrivate)
                    || (!x.IsPrivate && x.IsAuthenticationRestricted && isAuthenticated)
                    || (x.IsPrivate && x.ApplicationUserId == userId))
                .ToListAsync();
        }

        public async Task<Realm> GetRealmAsync(string code)
        {
            return await _context.Realms.FirstOrDefaultAsync(x => x.Code == code);
        }

    }
}
