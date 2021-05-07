using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Wiki.Data
{
    public class RealmShard : BaseEntity<RealmShard>
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }
        public bool IsOrdered { get; set; }

        // Relations
        public int RealmId { get; set; }
        public Realm Realm { get; set; }

        public ICollection<RealmShardEntry> RealmShardEntries { get; } = new List<RealmShardEntry>();


    }
}