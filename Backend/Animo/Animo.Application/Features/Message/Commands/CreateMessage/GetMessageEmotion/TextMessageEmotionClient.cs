using Animo.Application.Models.APIs.RapidAPI;
using Newtonsoft.Json;
using System.Web;

namespace Animo.Application.Features.Message.Commands.CreateMessage.GetMessageEmotion;

public static class TextMessageEmotionClient
{
    private readonly static HttpClient Client = new HttpClient();
    private readonly static UriBuilder UriBuilder = new UriBuilder("https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/");

    public async static Task<RapidApiEmotionAnalysisDto?> GetMessageEmotionAsync(string message)
    {
        var query = HttpUtility.ParseQueryString(UriBuilder.Query);
        query["text"] = message;
        UriBuilder.Query = query.ToString();

        var request = new HttpRequestMessage
        {
            Method = HttpMethod.Get,
            RequestUri = UriBuilder.Uri,
            Headers =
            {
                { "X-RapidAPI-Key", DotNetEnv.Env.GetString("X__RAPIDAPI__KEY") },
                { "X-RapidAPI-Host", "twinword-emotion-analysis-v1.p.rapidapi.com" },
            }
        };

        using var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Text Message Emotion Body: " + body);
        response.EnsureSuccessStatusCode();
        return JsonConvert.DeserializeObject<RapidApiEmotionAnalysisDto>(body);
    }
}
