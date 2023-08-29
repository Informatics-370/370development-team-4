using Microsoft.EntityFrameworkCore.ChangeTracking;
using Org.BouncyCastle.Asn1.Mozilla;
using Twilio.Clients;
using Twilio.Http;

namespace BOX.Services
{
    public class TwilioClient : ITwilioRestClient
    {
        private readonly ITwilioRestClient _innerClient;

        public TwilioClient(IConfiguration config, System.Net.Http.HttpClient httpClient)
        {
            httpClient.DefaultRequestHeaders.Add("X-Custom-Header", "CustomTwilioRestClient");
            _innerClient = new TwilioRestClient(
                config["Twilio:AccountSid"],
                config["Twilio:AuthToken"],
                httpClient: new SystemNetHttpClient(httpClient));
        }

        public Response Request(Request request) => _innerClient.Request(request);
        public Task<Response> RequestAsync(Request request) => _innerClient.RequestAsync(request);
        public string AccountSid => _innerClient.AccountSid;
        public string Region => _innerClient.Region;
        public Twilio.Http.HttpClient HttpClient => _innerClient.HttpClient;
    }
}
