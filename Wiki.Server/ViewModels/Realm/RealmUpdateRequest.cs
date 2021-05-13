using System.Collections.Generic;
using Wiki.ViewModels.Tag;

namespace Wiki.ViewModels.Realm
{
    public class RealmUpdateRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsAuthenticationRestricted { get; set; }
        public bool IsPrivate { get; set; }

        public List<RealmShardInputModel> Shards { get; set; }
        public List<TagInputModel> TagList { get; set; }

    }

}