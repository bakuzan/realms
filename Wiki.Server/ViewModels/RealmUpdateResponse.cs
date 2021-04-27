namespace Wiki.ViewModels
{
    public class RealmUpdateResponse : BaseResponse<RealmUpdateResponse>
    {
        public RealmItemViewModel Data { get; set; }
    }
}