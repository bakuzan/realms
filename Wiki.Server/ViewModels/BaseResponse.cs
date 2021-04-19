using System.Collections.Generic;
using System.Linq;

namespace Wiki.ViewModels
{
    public abstract class BaseResponse<T> where T : BaseResponse<T>
    {
        public BaseResponse()
        {
            ErrorMessages = new List<string>();
        }

        public List<string> ErrorMessages { get; set; }
        public bool Success => !ErrorMessages.Any();
    }
}