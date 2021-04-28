using System.Linq;
using Wiki.Enums;

namespace Wiki.Data
{
    public class TagDataService : DataService, ITagDataService
    {
        private readonly DatabaseContext _context;

        public TagDataService(DatabaseContext context) : base(context)
        {
            _context = context;
        }

        public IQueryable<Tag> GetTagsForScopeQuery(TagScope tagScope)
        {
            return _context.Tags.Where(x => x.TagScope == tagScope);
        }

    }
}
