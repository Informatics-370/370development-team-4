using BOX.Models;
using BOX.ViewModel;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;

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

        /*Email service uses plain text. I wanna use html. There is no bloody convert html to plain text function so I'll just 
         REDO THE GOSH DAMN EMAIL SERVICE MY GOSH DARN SELF. COS WHY THE FRICK NOT!!!! */
        [HttpPost]
        [Route("SendEmail")]
        public async Task<IActionResult> SendEmail(EmailViewModel email) //returns true if email sends successfully
        {
            try
            {
                var message = new Message(new string[] { email.TargetEmailAddress }, email.Subject, email.Body);
                //create email message
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("noreply@megapack.com", _emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Subject = message.Subject;
                //get text part of email body
                //THIS IS IT. THE ONE BLOODY LINE I WANTED TO CHANGE THAT WARRATED RECOPYING THE WHOLE DAMN EMAIL SERVICE
                var emailBody = new TextPart(MimeKit.Text.TextFormat.Html)
                {
                    Text = message.Content
                };

                var multipart = new Multipart("mixed")
                {
                    emailBody
                };
                //var emailMessage = CreateEmailMessage(message);

                //add attachments if list of attachments is provided
                foreach (var attachmentViewModel in email.Attachments)
                {
                    var attachment = CreateAttachmentFromBase64(attachmentViewModel.FileName, attachmentViewModel.FileBase64);
                    multipart.Add(attachment);
                }

                emailMessage.Body = multipart;

                if (Send(emailMessage)) return Ok(true);
                else return Ok(false);
            }
            catch (Exception)
            {
                return BadRequest(false);
            }
        }

        private MimePart CreateAttachmentFromBase64(string attachmentName, string attachmentBase64)
        {
            var attachment = new MimePart()
            {
                Content = new MimeContent(new MemoryStream(Convert.FromBase64String(attachmentBase64))),
                ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                ContentTransferEncoding = ContentEncoding.Base64,
                FileName = attachmentName
            };

            return attachment;
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
