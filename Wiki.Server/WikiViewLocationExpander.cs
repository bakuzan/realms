using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Razor;

namespace Wiki
{
    public class WikiViewLocationExpander : IViewLocationExpander
    {

        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context,
                                                       IEnumerable<string> viewLocations)
        {
            viewLocations = viewLocations.Select(s => s.Replace("Views", "Wiki.Server/Pages"));

            return viewLocations;
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        { }
    }
}