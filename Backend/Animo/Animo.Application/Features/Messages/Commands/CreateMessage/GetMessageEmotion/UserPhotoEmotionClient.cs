using Animo.Application.Models.APIs.MoodScannerAPI;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace Animo.Application.Features.Messages.Commands.CreateMessage.GetMessageEmotion;

public static class UserPhotoEmotionClient
{
    private readonly static HttpClient Client = new HttpClient();
    private readonly static UriBuilder UriBuilder = new UriBuilder($"{DotNetEnv.Env.GetString("MOOD_SCANNER_URL")}/detect_face_emotion");

    public async static Task<MoodScannerDetectFaceEmotionDto?> GetUserPhotoEmotionAsync(IFormFile photo)
    {
        using var content = new MultipartFormDataContent();
        await using var stream = photo.OpenReadStream();
        var imageContent = new StreamContent(stream);
        imageContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

        content.Add(imageContent, "image", photo.FileName);

        var request = new HttpRequestMessage
        {
            Method = HttpMethod.Post,
            RequestUri = UriBuilder.Uri,
            Content = content
        };

        using var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        Console.WriteLine("User Photo Emotion Body: " + body);
        response.EnsureSuccessStatusCode();
        return JsonConvert.DeserializeObject<MoodScannerDetectFaceEmotionDto>(body);
    }
}
