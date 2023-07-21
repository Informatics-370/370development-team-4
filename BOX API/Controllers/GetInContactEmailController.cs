using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using MimeKit;

namespace BOX.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class GetInContactEmailController : ControllerBase
  {
    [HttpPost]
    public IActionResult SendEmail(string recipientEmail, string subject, string body, IFormFileCollection attachments)
    {
      var email = new MimeMessage();
      email.From.Add(MailboxAddress.Parse("warren.lakin65@ethereal.email"));
      email.To.Add(MailboxAddress.Parse(recipientEmail));
      email.Subject = subject;
      email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = body };

      using var smtp = new SmtpClient();
      smtp.Connect("smtp.ethereal.email", 587, MailKit.Security.SecureSocketOptions.StartTls);
      smtp.Authenticate("warren.lakin65@ethereal.email", "xAzbh6g8nPSxGRyWZX");

      // Attach files, if any
      foreach (var attachment in attachments)
      {
        var attachmentStream = attachment.OpenReadStream();
        var mimeAttachment = new MimePart(attachment.ContentType)
        {
          Content = new MimeContent(attachmentStream, ContentEncoding.Default),
          ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
          ContentTransferEncoding = ContentEncoding.Base64,
          FileName = attachment.FileName
        };

        email.Body = new Multipart("mixed") { mimeAttachment, email.Body };
      }

      smtp.Send(email);
      smtp.Disconnect(true);

      return Ok();
    }
  }
}
