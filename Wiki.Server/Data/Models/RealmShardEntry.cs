namespace Wiki.Data
{
    public class RealmShardEntry : BaseEntity<RealmShardEntry>
    {
        public int? EntryOrder { get; set; }

        // Relations
        public int RealmShardId { get; set; }
        public RealmShard RealmShard { get; set; }
        public int FragmentId { get; set; }
        public Fragment Fragment { get; set; }


    }
}