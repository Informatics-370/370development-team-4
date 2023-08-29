using System.Web.Mvc;
using BOX.Models;
using Microsoft.AspNetCore.SignalR;

namespace BOX.Hub
{
    [Route("registrationHub")]
    public class RegistrationHub : Microsoft.AspNetCore.SignalR.Hub
    {

        private readonly AppDbContext _context; // Inject your DbContext

        public RegistrationHub(AppDbContext context)
        {
            _context = context;
        }

        public async Task SendRegistrationAlert(string message)
        {
            // Broadcast the inventory update to all connected clients
            await Clients.All.SendAsync("SendRegistrationAlert", message);
        }
    }
}
