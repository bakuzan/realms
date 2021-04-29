using Wiki.Enums;

namespace Wiki.ViewModels.Tag
{
    public class TagViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public TagScope TagScope { get; set; }

    }
}
