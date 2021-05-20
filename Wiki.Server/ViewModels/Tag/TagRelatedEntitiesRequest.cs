using System.Collections.Generic;
using Wiki.Enums;

namespace Wiki.ViewModels.Tag
{
    public class TagRelatedEntitiesRequest
    {
        public List<string> TagCodes { get; set; }
        public string RealmCode { get; set; }

    }
}
