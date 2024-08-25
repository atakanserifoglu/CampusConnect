namespace my_new_app.Services
{
    public interface IEmailService
    {
        void SendEmail(string email, string subject, string body);
    }
}
