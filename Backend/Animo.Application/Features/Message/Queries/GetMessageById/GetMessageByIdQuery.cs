using MediatR;

namespace Animo.Application.Features.Message.Queries.GetMessageById;

public class GetMessageByIdQuery : IRequest<GetMessageByIdResponse>
{
    public string MessageId { get; set; }
}
