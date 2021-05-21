using Wiki.Enums;

namespace Wiki.ViewModels.Fragment
{
    public class FragmentRelationViewModel : FragmentItemViewModel
    {
        public string ShardCode { get; set; }
        public string ShardName { get; set; }
        public FragmentRelation FragmentRelation { get; set; }

    }

}