using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using my_new_app.Models;
using MailKit.Net.Smtp;

namespace my_new_app.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration config)
        {
            _configuration = config;
        }
        public void SendEmail(string Email, string subject, string body)
        {
                    var email = new MimeMessage();
                    email.From.Add(MailboxAddress.Parse("campusconnecthelp3@outlook.com"));
                    email.To.Add(MailboxAddress.Parse(Email));
                    email.Subject = subject;
                    email.Body = new TextPart(TextFormat.Html) { Text = body };

                    using var smtp = new SmtpClient();
                    smtp.Connect("smtp-mail.outlook.com", 587, SecureSocketOptions.StartTls);
                    smtp.Authenticate("campusconnecthelp3@outlook.com", "Sogen04042003");
                    smtp.Send(email);
                    smtp.Disconnect(true);
        }
    }
}
