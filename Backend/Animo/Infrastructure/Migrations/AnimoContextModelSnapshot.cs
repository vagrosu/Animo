﻿// <auto-generated />
using System;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    [DbContext(typeof(AnimoContext))]
    partial class AnimoContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Animo.Domain.Common.Message", b =>
                {
                    b.Property<Guid>("MessageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("ChatRoomId")
                        .HasColumnType("uuid");

                    b.Property<bool>("IsForwarded")
                        .HasColumnType("boolean");

                    b.Property<Guid>("MessageEmotionId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("RepliedMessageMessageId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("SenderId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("SentTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("UserPhotoEmotionId")
                        .HasColumnType("uuid");

                    b.HasKey("MessageId");

                    b.HasIndex("ChatRoomId");

                    b.HasIndex("MessageEmotionId");

                    b.HasIndex("RepliedMessageMessageId");

                    b.HasIndex("SenderId");

                    b.HasIndex("UserPhotoEmotionId");

                    b.ToTable("Message");

                    b.UseTptMappingStrategy();
                });

            modelBuilder.Entity("Animo.Domain.Entities.ChatRoom", b =>
                {
                    b.Property<Guid>("ChatRoomId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastUsedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("ChatRoomId");

                    b.ToTable("ChatRooms");
                });

            modelBuilder.Entity("Animo.Domain.Entities.ChatRoomMember", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("ChatRoomId")
                        .HasColumnType("uuid");

                    b.Property<int>("ChatRole")
                        .HasColumnType("integer");

                    b.Property<DateTime>("JoinedTime")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("UserId", "ChatRoomId");

                    b.HasIndex("ChatRoomId");

                    b.ToTable("ChatRoomMembers");
                });

            modelBuilder.Entity("Animo.Domain.Entities.MessageEmotion", b =>
                {
                    b.Property<Guid>("MessageEmotionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<float>("Anger")
                        .HasColumnType("real");

                    b.Property<float>("Disgust")
                        .HasColumnType("real");

                    b.Property<float>("Fear")
                        .HasColumnType("real");

                    b.Property<float>("Joy")
                        .HasColumnType("real");

                    b.Property<float>("Sadness")
                        .HasColumnType("real");

                    b.Property<float>("Surprise")
                        .HasColumnType("real");

                    b.HasKey("MessageEmotionId");

                    b.ToTable("MessageEmotions");
                });

            modelBuilder.Entity("Animo.Domain.Entities.MessageReaction", b =>
                {
                    b.Property<Guid>("MessageReactionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Emoji")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("character varying(20)");

                    b.Property<Guid?>("ImageMessageMessageId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("TextMessageMessageId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("MessageReactionId");

                    b.HasIndex("ImageMessageMessageId");

                    b.HasIndex("TextMessageMessageId");

                    b.HasIndex("UserId");

                    b.ToTable("MessageReactions");
                });

            modelBuilder.Entity("Animo.Domain.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("Users", (string)null);
                });

            modelBuilder.Entity("Animo.Domain.Entities.UserPhotoEmotion", b =>
                {
                    b.Property<Guid>("UserPhotoEmotionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<float>("Anger")
                        .HasColumnType("real");

                    b.Property<float>("Disgust")
                        .HasColumnType("real");

                    b.Property<float>("Fear")
                        .HasColumnType("real");

                    b.Property<float>("Joy")
                        .HasColumnType("real");

                    b.Property<float>("Sadness")
                        .HasColumnType("real");

                    b.Property<float>("Surprise")
                        .HasColumnType("real");

                    b.HasKey("UserPhotoEmotionId");

                    b.ToTable("UserPhotoEmotions");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole<System.Guid>", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uuid");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("Animo.Domain.Entities.ImageMessage", b =>
                {
                    b.HasBaseType("Animo.Domain.Common.Message");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.ToTable("ImageMessages", (string)null);
                });

            modelBuilder.Entity("Animo.Domain.Entities.TextMessage", b =>
                {
                    b.HasBaseType("Animo.Domain.Common.Message");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("text");

                    b.ToTable("TextMessages", (string)null);
                });

            modelBuilder.Entity("Animo.Domain.Common.Message", b =>
                {
                    b.HasOne("Animo.Domain.Entities.ChatRoom", "ChatRoom")
                        .WithMany()
                        .HasForeignKey("ChatRoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Animo.Domain.Entities.MessageEmotion", "MessageEmotion")
                        .WithMany()
                        .HasForeignKey("MessageEmotionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Animo.Domain.Common.Message", "RepliedMessage")
                        .WithMany()
                        .HasForeignKey("RepliedMessageMessageId");

                    b.HasOne("Animo.Domain.Entities.User", "Sender")
                        .WithMany()
                        .HasForeignKey("SenderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Animo.Domain.Entities.UserPhotoEmotion", "UserPhotoEmotion")
                        .WithMany()
                        .HasForeignKey("UserPhotoEmotionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ChatRoom");

                    b.Navigation("MessageEmotion");

                    b.Navigation("RepliedMessage");

                    b.Navigation("Sender");

                    b.Navigation("UserPhotoEmotion");
                });

            modelBuilder.Entity("Animo.Domain.Entities.ChatRoomMember", b =>
                {
                    b.HasOne("Animo.Domain.Entities.ChatRoom", null)
                        .WithMany("ChatRoomMembers")
                        .HasForeignKey("ChatRoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Animo.Domain.Entities.User", null)
                        .WithMany("ChatRoomMembers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Animo.Domain.Entities.MessageReaction", b =>
                {
                    b.HasOne("Animo.Domain.Entities.ImageMessage", null)
                        .WithMany("MessageReactions")
                        .HasForeignKey("ImageMessageMessageId");

                    b.HasOne("Animo.Domain.Entities.TextMessage", "TextMessage")
                        .WithMany("MessageReactions")
                        .HasForeignKey("TextMessageMessageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Animo.Domain.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("TextMessage");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole<System.Guid>", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.HasOne("Animo.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.HasOne("Animo.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole<System.Guid>", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Animo.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.HasOne("Animo.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Animo.Domain.Entities.ImageMessage", b =>
                {
                    b.HasOne("Animo.Domain.Common.Message", null)
                        .WithOne()
                        .HasForeignKey("Animo.Domain.Entities.ImageMessage", "MessageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Animo.Domain.Entities.TextMessage", b =>
                {
                    b.HasOne("Animo.Domain.Common.Message", null)
                        .WithOne()
                        .HasForeignKey("Animo.Domain.Entities.TextMessage", "MessageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Animo.Domain.Entities.ChatRoom", b =>
                {
                    b.Navigation("ChatRoomMembers");
                });

            modelBuilder.Entity("Animo.Domain.Entities.User", b =>
                {
                    b.Navigation("ChatRoomMembers");
                });

            modelBuilder.Entity("Animo.Domain.Entities.ImageMessage", b =>
                {
                    b.Navigation("MessageReactions");
                });

            modelBuilder.Entity("Animo.Domain.Entities.TextMessage", b =>
                {
                    b.Navigation("MessageReactions");
                });
#pragma warning restore 612, 618
        }
    }
}
