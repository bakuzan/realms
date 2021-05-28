using System.Collections.Generic;

namespace Wiki.ViewModels.Fragment
{
    public class FragmentMatchResponse : BaseResponse<FragmentMatchResponse>
    {
        public List<FragmentMatchViewModel> Data { get; set; }
    }
}