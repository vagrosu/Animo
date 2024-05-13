using Animo.Application.Persistence;
using Animo.Domain.Entities;

namespace Infrastructure.Repositories;

public class MessageEmotionRepository : BaseRepository<MessageEmotion>, IMessageEmotionRepository
{

    public MessageEmotionRepository(AnimoContext context) : base(context)
    {
    }
}
