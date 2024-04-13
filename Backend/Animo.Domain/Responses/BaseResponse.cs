namespace Animo.Domain.Responses;

public class BaseResponse
{
    public BaseResponse(bool success, int? statusCode = 200, string? message = null)
    {
        Success = success;
        Message = message;
        StatusCode = statusCode ?? (success ? 200 : 400);
    }

    public bool Success { get; }
    public int StatusCode { get; }
    public string? Message { get; }
    public IEnumerable<string>? ValidationErrors { get; private set; }

    public void AddValidationError(string error)
    {
        ValidationErrors ??= new List<string>();
        ((List<string>)ValidationErrors).Add(error);
    }}
