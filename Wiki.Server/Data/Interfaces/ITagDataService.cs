using System.Linq;
using Wiki.Enums;

namespace Wiki.Data
{
    public interface ITagDataService : IDataService
    {
        IQueryable<Tag> GetTagsForScopeQuery(TagScope tagScope);

    }
}
