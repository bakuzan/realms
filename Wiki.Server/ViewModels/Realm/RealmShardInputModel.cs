using System.Collections.Generic;

namespace Wiki.ViewModels.Realm
{
    public class RealmShardInputModel
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public bool IsOrdered { get; set; }

        public List<RealmShardEntryInputModel> EntryList { get; set; }

    }

}