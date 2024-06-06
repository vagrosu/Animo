using Animo.Application.Persistence;
using Animo.Domain.Entities;

namespace Infrastructure.Repositories;

public class UserPhotoEmotionRepository : BaseRepository<UserPhotoEmotion>, IUserPhotoEmotionRepository
{

    public UserPhotoEmotionRepository(AnimoContext context) : base(context)
    {
    }
}
