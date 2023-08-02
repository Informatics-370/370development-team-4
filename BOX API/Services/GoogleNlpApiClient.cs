using Google.Api.Gax.Grpc;
using Google.Cloud.Language.V1;
using Grpc.Core;
using Microsoft.Extensions.Configuration;
using System;
using System.Text;

namespace BOX.Services
{
    public class GoogleNlpApiClient : INlpService
    {
        private readonly LanguageServiceClient _languageClient;

        public GoogleNlpApiClient(string apiKey)
        {
            var settings = new LanguageServiceSettings
            {
                CallSettings = CallSettings.FromHeader("X-Goog-Api-Key", "AIzaSyD0UVvzq0ByzZ58ilFc6tXfD1q-L3nqX-E")
            };

            _languageClient = new LanguageServiceClientBuilder
            {
                ChannelCredentials = ChannelCredentials.SecureSsl,
                Settings = settings
            }.Build();
        }

        public async Task<double> AnalyzeSentimentAsync(string text)
        {
            var document = new Document
            {
                Content = text,
                Type = Document.Types.Type.PlainText
            };

            var response = await _languageClient.AnalyzeSentimentAsync(document);

            return response.DocumentSentiment.Score;
        }
    }
}
