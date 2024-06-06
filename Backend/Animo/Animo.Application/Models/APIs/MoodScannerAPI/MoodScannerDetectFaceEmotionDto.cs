using Newtonsoft.Json;

namespace Animo.Application.Models.APIs.MoodScannerAPI;

public class MoodScannerDetectFaceEmotionDto
{
    [JsonProperty("success")]
    public bool Success { get; set; }

    [JsonProperty("message")]
    public string? Message { get; set; }

    [JsonProperty("detectedEmotions")]
    public Dictionary<string, float>? DetectedEmotions { get; set; }
}
