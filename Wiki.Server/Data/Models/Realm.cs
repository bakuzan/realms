using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Wiki.Data.Models;

namespace Wiki.Data
{
    public class Realm : BaseEntity<Realm>
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }
        public bool IsAuthenticationRestricted { get; set; }
        public bool IsPrivate { get; set; }

        // Relations
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

        public ICollection<Fragment> Fragments { get; } = new List<Fragment>();
        public ICollection<Tag> Tags { get; } = new List<Tag>();

    }
}