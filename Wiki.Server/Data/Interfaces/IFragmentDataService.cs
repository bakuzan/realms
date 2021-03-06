using System.Collections.Generic;
using System.Threading.Tasks;

namespace Wiki.Data
{
    public interface IFragmentDataService : IDataService
    {
        Task<Fragment> GetFragmentAsync(string code);
        Task<List<Fragment>> GetFragmentsForRealm(int realmId);
        Task<List<RealmShard>> GetOrderedShardsFragmentBelongsTo(int fragmentId);
        Task<List<Fragment>> FilterRealmFragments(int realmId, string filter);

    }
}
