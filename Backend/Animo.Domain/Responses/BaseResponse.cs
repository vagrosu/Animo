namespace Animo.Domain.Responses;

public class BaseResponse
{
    public BaseResponse() => Success = true;

    public BaseResponse(bool success, int? statusCode = 200, string? message = null)
    {
        Success = success;
        Message = message;
        StatusCode = statusCode ?? (success ? 200 : 400);
    }

    public bool Success { get; set; }
    public int StatusCode { get; set; }
    public string? Message { get; set; }
    public IEnumerable<string> ValidationsErrors { get; set; }
}
