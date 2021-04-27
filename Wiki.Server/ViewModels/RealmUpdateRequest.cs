using System.Collections.Generic;

namespace Wiki.ViewModels
{
    public class RealmUpdateRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsAuthenticationRestricted { get; set; }
        public bool IsPrivate { get; set; }

        public List<TagInputModel> TagList { get; set; }

    }

}