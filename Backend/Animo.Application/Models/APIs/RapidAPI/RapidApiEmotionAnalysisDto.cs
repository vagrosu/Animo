using Newtonsoft.Json;

namespace Animo.Application.Models.APIs.RapidAPI;

public class RapidApiEmotionAnalysisDto
{
    [JsonProperty("emotions_detected")]
    public List<string>? EmotionsDetected { get; set; }

    [JsonProperty("emotion_scores")]
    public Dictionary<string, float>? EmotionScores { get; set; }

    [JsonProperty("emotions_normalized")]
    public Dictionary<string, float>? EmotionsNormalized { get; set; }

    [JsonProperty("thresholds_normalized")]
    public Dictionary<string, float>? ThresholdsNormalized { get; set; }

    [JsonProperty("version")]
    public string? Version { get; set; }

    [JsonProperty("author")]
    public string? Author { get; set; }

    [JsonProperty("email")]
    public string? Email { get; set; }

    [JsonProperty("result_code")]
    public string? ResultCode { get; set; }

    [JsonProperty("result_msg")]
    public string? ResultMsg { get; set; }
}
