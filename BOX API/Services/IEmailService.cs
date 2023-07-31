using BOX.Models;

namespace BOX.Services
{
    public interface IEmailService
    {
        void SendEmail(Message message);
    }
}
