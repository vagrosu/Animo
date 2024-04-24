using Animo.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class AnimoContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public AnimoContext(DbContextOptions<AnimoContext> options) : base(options) { }

    public DbSet<ChatRoom> ChatRooms { get; set; }
    public DbSet<ChatRoomMember> ChatRoomMembers { get; set; }
    public DbSet<TextMessage> TextMessages { get; set; }
    public DbSet<ImageMessage> ImageMessages { get; set; }
    public DbSet<MessageReaction> MessageReactions { get; set; }
    public DbSet<MessageEmotion> MessageEmotions { get; set; }
    public DbSet<UserPhotoEmotion> UserPhotoEmotions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ChatRoomMember>()
            .HasKey(crm => new { crm.UserId, crm.ChatRoomId });

        modelBuilder.Entity<TextMessage>().ToTable("TextMessages");
        modelBuilder.Entity<ImageMessage>().ToTable("ImageMessages");
        modelBuilder.Entity<User>().ToTable("Users");
    }
}
