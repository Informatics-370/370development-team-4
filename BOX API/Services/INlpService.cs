namespace BOX.Services
{
    public interface INlpService
    {
        Task<double> AnalyzeSentimentAsync(string text);
        Task<string> TranslateTextToEnglishAsync(string text);
    }
}
