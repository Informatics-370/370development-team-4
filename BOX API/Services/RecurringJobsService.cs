using BOX.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol.Core.Types;

namespace BOX.Services
{
    public class RecurringJobsService
    {
        private readonly IRepository _repository;

        public RecurringJobsService(IRepository repository)
        {
            _repository = repository;
        }

        public async Task ExpireQuotes()
        {
            try
            {
                var generatedQuotes = await _repository.GetQuotesByStatus(1); //get all quotes with status of generated
                var duration = await _repository.GetQuoteDurationAsync(1); //get quote duration
                DateTime today = DateTime.Now;

                foreach (var quote in generatedQuotes)
                {
                    DateTime expiryDate = quote.Date_Generated.AddDays(duration.Duration); //get this quote's expiry date
                    if (today.Date == expiryDate.Date) //compare dates only, not time
                    {
                        quote.QuoteStatusID = 5; //change quote status to expired
                    }
                }

                await _repository.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Could not fully expire quotes: " + ex.Message + " due to: " + ex.InnerException);
            }
        }
    }
}
