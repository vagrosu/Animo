using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNeutralEmotionColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_MessageEmotions_MessageEmotionId",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_UserPhotoEmotions_UserPhotoEmotionId",
                table: "Message");

            migrationBuilder.AddColumn<float>(
                name: "Neutral",
                table: "UserPhotoEmotions",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "Neutral",
                table: "MessageEmotions",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserPhotoEmotionId",
                table: "Message",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "MessageEmotionId",
                table: "Message",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_MessageEmotions_MessageEmotionId",
                table: "Message",
                column: "MessageEmotionId",
                principalTable: "MessageEmotions",
                principalColumn: "MessageEmotionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_UserPhotoEmotions_UserPhotoEmotionId",
                table: "Message",
                column: "UserPhotoEmotionId",
                principalTable: "UserPhotoEmotions",
                principalColumn: "UserPhotoEmotionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_MessageEmotions_MessageEmotionId",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_UserPhotoEmotions_UserPhotoEmotionId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "Neutral",
                table: "UserPhotoEmotions");

            migrationBuilder.DropColumn(
                name: "Neutral",
                table: "MessageEmotions");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserPhotoEmotionId",
                table: "Message",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "MessageEmotionId",
                table: "Message",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_MessageEmotions_MessageEmotionId",
                table: "Message",
                column: "MessageEmotionId",
                principalTable: "MessageEmotions",
                principalColumn: "MessageEmotionId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_UserPhotoEmotions_UserPhotoEmotionId",
                table: "Message",
                column: "UserPhotoEmotionId",
                principalTable: "UserPhotoEmotions",
                principalColumn: "UserPhotoEmotionId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
