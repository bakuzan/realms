using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Wiki.Data
{
    public class Fragment : BaseEntity<Fragment>
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }
        public string Content { get; set; }

        // Relations
        public int RealmId { get; set; }
        public Realm Realm { get; set; }

        public ICollection<Tag> Tags { get; } = new List<Tag>();

    }
}