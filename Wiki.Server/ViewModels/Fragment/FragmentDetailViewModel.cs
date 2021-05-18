using System.Collections.Generic;
using Wiki.ViewModels.Tag;

namespace Wiki.ViewModels.Fragment
{
    public class FragmentDetailViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Content { get; set; }
        public List<TagViewModel> Tags { get; set; }
        public string RealmOwnerUserId { get; set; }

        public List<FragmentRelationViewModel> RelatedFragments { get; set; }

    }

}