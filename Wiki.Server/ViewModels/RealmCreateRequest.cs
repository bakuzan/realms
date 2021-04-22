namespace Wiki.ViewModels
{
    public class RealmCreateRequest
    {
        public string Name { get; set; }
        public bool IsAuthenticationRestricted { get; set; }
        public bool IsPrivate { get; set; }
    }

}