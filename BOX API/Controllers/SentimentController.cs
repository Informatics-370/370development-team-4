using BOX.Models;
using BOX.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SentimentController : ControllerBase
    {
        private readonly INlpService _nlpService;
        private readonly AppDbContext _dbContext;

        public SentimentController(INlpService nlpService, AppDbContext dbContext)
        {
            _nlpService = nlpService;
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> AnalyzeReviewSentiments()
        {
            var reviews = await _dbContext.Customer_Review.ToListAsync(); // Fetch all reviews
            var sentimentCounts = new int[5]; // Index 0: Highly Negative, Index 1: Negative, and so on...

            foreach (var review in reviews)
            {
                string translatedText = await _nlpService.TranslateTextToEnglishAsync(review.Comments);
                var sentimentScore = await _nlpService.AnalyzeSentimentAsync(translatedText);
                var sentimentCategory = GetSentimentCategory(sentimentScore);

                sentimentCounts[(int)sentimentCategory]++;
            }

            return Ok(sentimentCounts);
        }

        [HttpGet]
        [Route("average-rating")]   
        public async Task<IActionResult> GetAverageProductRating()
        {
            double averageRating = await _dbContext.Customer_Review.AverageAsync(review => review.Product_Rating);
            return Ok(averageRating);
        }

        [HttpGet]
        [Route("recommendation-percentage")]
        public async Task<IActionResult> GetRecommendationPercentage()
        {
            int totalReviews = await _dbContext.Customer_Review.CountAsync();
            int recommendCount = await _dbContext.Customer_Review.CountAsync(review => review.Recommendation == true);

            double recommendationPercentage = (double)recommendCount / totalReviews * 100;
            return Ok(recommendationPercentage);
        }

        [HttpGet]
        [Route("non-recommendation-percentage")]
        public async Task<IActionResult> GetNonRecommendationPercentage()
        {
            int totalReviews = await _dbContext.Customer_Review.CountAsync();
            int nonRecommendCount = await _dbContext.Customer_Review.CountAsync(review => review.Recommendation == false);

            double nonRecommendationPercentage = (double)nonRecommendCount / totalReviews * 100;
            return Ok(nonRecommendationPercentage);
        }


        private SentimentCategory GetSentimentCategory(double score)
        {
            if (score >= 0.8)
            {
                return SentimentCategory.HighlyPositive;
            }
            else if (score >= 0.5)
            {
                return SentimentCategory.Positive;
            }
            else if (score >= -0.5)
            {
                return SentimentCategory.Neutral;
            }
            else if (score >= -0.8)
            {
                return SentimentCategory.Negative;
            }
            else
            {
                return SentimentCategory.HighlyNegative;
            }
        }
    }

    public enum SentimentCategory
    {
        HighlyNegative,
        Negative,
        Neutral,
        Positive,
        HighlyPositive
    }
}
