using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BOX.Services;
using MailKit.Net.Smtp;
using MimeKit;
using BOX.Models;
using BOX.ViewModel;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class EmailController : ControllerBase
    {

        //private readonly IEmailService _emailService;
        private readonly EmailConfiguration _emailConfig;

        public EmailController(EmailConfiguration emailConfig)
        {
            //_emailService = emailService;
            _emailConfig = emailConfig;
        }

        [HttpPost]
        [Route("SendEmail")]
        public async Task<IActionResult> SendEmail(EmailViewModel email) //returns true if email sends successfully
        {
            try
            {
                var message = new Message(new string[] { email.TargetEmailAddress }, email.Subject, email.Body);
                var emailMessage = CreateEmailMessage(message);
                
                if (Send(emailMessage)) return Ok(true);
                else return Ok(false);
            }
            catch (Exception)
            {
                return BadRequest(false);
            }            
        }

        /*Email service uses plain text. I wanna use html. There is no bloody convert html to plain text function so I'll just 
         REDO THE GOSH DAMN EMAIL SERVICE MY GOSH DARN SELF. COS WHY THE FRICK NOT!!!! */
        private MimeMessage CreateEmailMessage(Message message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("noreply@megapack.com", _emailConfig.From));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;
            //THIS IS IT. THE ONE BLOODY LINE I WANTED TO CHANGE THAT WARRATED RECOPYING THE WHOLE DAMN EMAIL SERVICE
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = message.Content
            };

            return emailMessage;
        }

        private bool Send(MimeMessage mailMessage)
        {
            using var client = new SmtpClient();
            try
            {
                client.Connect(_emailConfig.SmtpServer, _emailConfig.Port, true);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                client.Authenticate(_emailConfig.Username, _emailConfig.Password);

                client.Send(mailMessage);
            }
            catch
            {
                return false;
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }

            return true;
        }
    }
}
