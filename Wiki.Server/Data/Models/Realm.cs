using Wiki.Data.Models;

namespace Wiki.Data
{
    public class Realm : BaseEntity<Realm>
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsAuthenticationRestricted { get; set; }
        public bool IsPrivate { get; set; }

        // Relations
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}