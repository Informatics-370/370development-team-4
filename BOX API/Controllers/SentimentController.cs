using BOX.Models;
using BOX.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using Microsoft.Extensions.ML;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SentimentController : ControllerBase
    {
        private readonly INlpService _nlpService;

        public SentimentController(INlpService nlpService)
        {
            _nlpService = nlpService;
        }

        [HttpPost]
        public async Task<IActionResult> AnalyzeSentiment([FromBody] SentimentRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request data.");
            }

            string translatedText = await _nlpService.TranslateTextToEnglishAsync(request.Text);

            var sentimentScore = await _nlpService.AnalyzeSentimentAsync(translatedText);
            var sentimentMessage = GetSentimentMessage(sentimentScore);

            return Ok(new { SentimentScore = sentimentScore, SentimentMessage = sentimentMessage, TranslatedText = translatedText });
        }

        private string GetSentimentMessage(double score)
        {
            string message;
            if (score >= 0.8)
            {
                message = "This text expresses a highly positive sentiment!";
            }
            else if (score >= 0.5)
            {
                message = "This text expresses a positive sentiment.";
            }
            else if (score >= 0.2)
            {
                message = "This text shows a mildly positive sentiment.";
            }
            else if (score >= -0.2)
            {
                message = "This text appears to be neutral in sentiment.";
            }
            else if (score >= -0.5)
            {
                message = "This text shows a mildly negative sentiment.";
            }
            else if (score >= -0.8)
            {
                message = "This text expresses a negative sentiment.";
            }
            else
            {
                message = "This text expresses a highly negative sentiment!";
            }
            return message;
        }

    }

    public class SentimentRequest
    {
        public string Text { get; set; }
    }
}
