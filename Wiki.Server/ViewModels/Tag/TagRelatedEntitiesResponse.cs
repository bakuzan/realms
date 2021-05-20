using System.Collections.Generic;

namespace Wiki.ViewModels.Tag
{
    public class TagRelatedEntitiesResponse : BaseResponse<TagRelatedEntitiesResponse>
    {
        public TagRelatedEntities Data { get; set; }

        public TagRelatedEntitiesResponse()
        {
            Data = new TagRelatedEntities();
        }

    }

    public class TagRelatedEntities
    {
        public string RealmName { get; set; }
        public List<TagDropdownModel> Tags { get; set; }
        public List<TagRelatedItem> Items { get; set; }


        public TagRelatedEntities()
        {
            Tags = new List<TagDropdownModel>();
            Items = new List<TagRelatedItem>();
        }
    }
}
