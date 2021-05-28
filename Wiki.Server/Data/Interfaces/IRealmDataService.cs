using System.Collections.Generic;
using System.Threading.Tasks;

namespace Wiki.Data
{
    public interface IRealmDataService : IDataService
    {
        Task<Realm> GetRealmById(int realmId);
        Task<Realm> GetRealmAsync(string code);
        Task<List<Realm>> GetRealms(string userId);
        Task<List<RealmShard>> GetRealmShardsForRealm(int realmId);


    }
}
