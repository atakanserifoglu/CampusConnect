using MailKit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using my_new_app.Services;
using IMailService = my_new_app.Services.IEmailService;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Http;
using MimeKit.Text;
using Microsoft.AspNetCore.Identity;

namespace my_new_app.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly UserManager<User> _userManager;
        public MailController(IEmailService emailService, UserManager<User> userManager)
        {
            _emailService = emailService;
            _userManager = userManager;
        }


        [HttpPost("SendMail")]

        public async Task<IActionResult> SendMail(MailModel mailModel)
        {
            var user = await _userManager.FindByIdAsync(mailModel.Id);
            _emailService.SendEmail(user.Email, mailModel.Subject, mailModel.Body);

            return Ok();
            
        }
    }
}
