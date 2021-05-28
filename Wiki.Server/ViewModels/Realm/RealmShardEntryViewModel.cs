namespace Wiki.ViewModels.Realm
{
    public class RealmShardEntryViewModel
    {
        public int Id { get; set; }
        public int? EntryOrder { get; set; }

        public int FragmentId { get; set; }
        public string FragmentName { get; set; }
        public string FragmentCode { get; set; }
        public string RealmCode { get; set; }


    }

}