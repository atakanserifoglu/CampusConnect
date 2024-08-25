namespace my_new_app.Models
{
    public class RegisterUser
    {
        public string Firstname { get; set; } //may be used as email we'll see

        public string Lastname { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
    }
}
