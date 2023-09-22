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

        private readonly EmailConfiguration _emailConfig;
        //get megapack logo to use in email header. Once website is deployed, we can use that URL instead
        private string logoLink = "https://i.ibb.co/72XFvDj/mega-pack-logo.png";
        //contains email footer
        //don't forget to change LinkedIn and FaceBook logo URLs to permanent site once website is deployed
        private string emailFooter = "<div id='email-footer' style='background-color: #373435; color: white; width: 100%;'> <div id='footer-content' style='width: 85%; margin: auto; padding: 1em;'> <p> Please don't reply to this email. If you have any questions, contact one of the following:<br/> 012 666 8540<br/> <a href='mailto:sales@megapack.co.za' target='_blank' style='color: white;'>sales@megapack.co.za</a> </p> <p>Or contact your dedicated salesperson. You can view their contact details from <a style='font-weight: 600; text-decoration: underline; cursor: pointer; color: white;' href='http://localhost:4200/profile-page'>your account.</a></p> <hr width='100%'/> <div id='social-media' style='margin: 1em 0; position: relative; width: 100%; height: 30px;'> <!--Facebook icon--> <a href='https://www.facebook.com/profile.php?id=100060048437989&mibextid=nW3QTL' style='font-weight: 600; cursor: pointer; position: absolute; top: 0; right: 52%;'> <img src='https://i.ibb.co/2dfzky2/facebook-white.png' alt='facebook-logo'  style=' height: 30px;'/> </a> <!--LinkedIn logo--> <a href='https://www.linkedin.com/company/mega-pack/about/' style='font-weight: 600; cursor: pointer; position: absolute; top: 0; left: 52%;'> <img src='https://i.ibb.co/FnSPw34/linkedin-white.png' alt='linkedin-logo' style=' height: 30px;'> </a> </div> <div style='width: 100%; text-align: center;'> <a href='http://www.megapack.co.za/' style='font-weight: normal; text-decoration: underline; cursor: pointer; color: white;'>Mega Pack</a> &copy; All Rights Reserved </div> </div> </div>";
            
        public EmailController(EmailConfiguration emailConfig)
        {
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
                //contains email header
                string emailHead = "<div id='email-header' style='background-color: #31AF99; color: white; width: 100%;'> <div id='header-content' style='width: 85%; margin: auto; padding: 1em; display: flex; align-items: center;'> <div id='header-img' style='display: inline-block;'> <img style='width: 100px; margin-right: 1em;' id='logo' alt='Mega Pack logo' src='" + logoLink + "' /> </div> <div id='header-text' style='display: inline-block;'> <div id='company-name' style='font-size: 1.8rem; font-weight: 600; margin-bottom: 0.25em;'>Mega Pack</div> <span id='slogan' style='font-weight: 400;'>All your packaging needs right here in Pretoria</span> </div> </div> </div>";
                //construct email body
                string emailBodyContent = "<div id='body-content' style='width: 85%; margin: auto; background-color: white; padding: 2rem 0;'> <h3>Hi " + email.TargetName + ",</h3>" + email.Body + "<br /> Kind regards<br /> MegaPack </div>";

                var message = new Message(new string[] { email.TargetEmailAddress }, email.Subject, emailBodyContent);
                
                //create email message
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("noreply@megapack.com", _emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Subject = message.Subject;
                
                //get text part of email body
                //THIS IS IT. THE ONE BLOODY LINE I WANTED TO CHANGE THAT WARRANTED RECOPYING THE WHOLE DAMN EMAIL SERVICE
                var emailBody = new TextPart(MimeKit.Text.TextFormat.Html)
                {
                    Text = "<div id='email-body' style='width: 100%; max-width: 100%; height: 100%; background-color: white; font-family: Tahoma, Arial, Helvetica, sans-serif;'>" + emailHead + message.Content + emailFooter + "</div>"
                };

                var multipart = new Multipart("mixed")
                {
                    emailBody
                };

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
            catch (Exception ex)
            {
                return BadRequest("Email could not be sent due to " + ex.Message + " caused by " + ex.InnerException);
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