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
    public IActionResult SendEmail(string body)
    {
      var email = new MimeMessage();
      email.From.Add(MailboxAddress.Parse("shawn.bosco@ethereal.email"));
      email.To.Add(MailboxAddress.Parse("shawn.bosco@ethereal.email"));

      email.Subject = "Shopping Cart Price Adjusting: Testing using API";
      email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = body };

      using var smtp = new SmtpClient();
      smtp.Connect("smtp.ethereal.email", 587, MailKit.Security.SecureSocketOptions.StartTls);
      smtp.Authenticate("shawn.bosco@ethereal.email", "TxqR6qYYzkzbHVs4s7");
      smtp.Send(email);
      smtp.Disconnect(true);


      return Ok();
    }
  }
}
