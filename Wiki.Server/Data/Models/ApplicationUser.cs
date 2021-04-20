using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Wiki.Data.Models
{
    public class ApplicationUser : IdentityUser
    {
        public List<Realm> Realms { get; set; }
    }
}
