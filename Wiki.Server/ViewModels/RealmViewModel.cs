namespace Wiki.ViewModels
{
    public class RealmViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsAuthenticationRestricted { get; set; }
        public bool IsPrivate { get; set; }
        public string RealmOwnerUserId { get; set; }

    }

}