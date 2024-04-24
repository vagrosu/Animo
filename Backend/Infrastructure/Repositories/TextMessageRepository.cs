using Animo.Application.Persistence;
using Animo.Domain.Entities;

namespace Infrastructure.Repositories;

public class TextMessageRepository : BaseRepository<TextMessage>, ITextMessageRepository
{

    public TextMessageRepository(AnimoContext context) : base(context)
    {
    }
}
