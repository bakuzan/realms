namespace Wiki.ViewModels.Realm
{
    public class RealmUpdateResponse : BaseResponse<RealmUpdateResponse>
    {
        public RealmItemViewModel Data { get; set; }
    }
}