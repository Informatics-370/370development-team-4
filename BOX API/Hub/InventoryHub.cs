using Microsoft.AspNetCore.SignalR;
using System.Web.Mvc;

namespace BOX.Hub
{
    [Route("inventoryHub")]
    public class InventoryHub : Microsoft.AspNetCore.SignalR.Hub
    {
        public async Task SendInventoryUpdate(string description, int quantityOnHand)
        {
            // Broadcast the inventory update to all connected clients
            await Clients.All.SendAsync("ReceiveInventoryUpdate", description, quantityOnHand);
        }
    }
}
