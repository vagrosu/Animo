using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Animo.Application.Models.Identity;

public class LoginModel
{
    [Required(ErrorMessage = "Email or Phone number is required")]
    public string Identifier { get; set; }

    [DataType(DataType.Password)]
    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; }
}
