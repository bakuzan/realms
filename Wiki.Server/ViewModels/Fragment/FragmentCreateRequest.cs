using System.Collections.Generic;
using Wiki.ViewModels.Tag;

namespace Wiki.ViewModels.Fragment
{
    public class FragmentCreateRequest
    {
        public int RealmId { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public List<TagInputModel> TagList { get; set; }

    }

}