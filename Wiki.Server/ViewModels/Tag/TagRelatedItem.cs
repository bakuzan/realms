using Wiki.Enums;

namespace Wiki.ViewModels.Tag
{
    public class TagRelatedItem
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? FragmentCount { get; set; }
        public string RealmCode { get; set; }
        public TagScope TagScope { get; set; }

    }
}
