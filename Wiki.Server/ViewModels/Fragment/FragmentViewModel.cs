using System.Collections.Generic;
using Wiki.ViewModels.Tag;

namespace Wiki.ViewModels.Fragment
{
    public class FragmentViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Content { get; set; }
        public List<TagViewModel> Tags { get; set; }
        public int RealmOwnerUserId { get; set; }

    }

}