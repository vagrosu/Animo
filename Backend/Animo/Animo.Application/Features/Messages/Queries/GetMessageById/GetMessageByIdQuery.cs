using MediatR;

namespace Animo.Application.Features.Messages.Queries.GetMessageById;

public class GetMessageByIdQuery : IRequest<GetMessageByIdResponse>
{
    public string MessageId { get; set; }
}
