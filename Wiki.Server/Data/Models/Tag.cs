using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Wiki.Enums;

namespace Wiki.Data
{
    public class Tag : BaseEntity<Tag>
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public TagScope TagScope { get; set; }

        // Relations
        public ICollection<Realm> Realms { get; } = new List<Realm>();
        public ICollection<Fragment> Fragments { get; } = new List<Fragment>();

    }
}