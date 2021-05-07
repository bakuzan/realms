using System.Collections.Generic;

namespace Wiki.ViewModels.Realm
{
    public class RealmShardViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsOrdered { get; set; }

        public List<RealmShardEntryViewModel> Entries { get; set; }

    }

}