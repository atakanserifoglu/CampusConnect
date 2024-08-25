namespace my_new_app.Models
{
    public class ChangePasswordUser
    {
        public string Token { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set;}

    }
}
