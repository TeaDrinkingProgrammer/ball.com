using System.ComponentModel.DataAnnotations;

namespace CustomerManagement.EventModels;

public class CustomerAccountCreated : CustomerBaseEvent
{
    [Required(ErrorMessage = "Name is required.")]
    public string Name { get; set; }
    [Required(ErrorMessage = "Email is required.")]
    public string Email { get; set; }
    [Required(ErrorMessage = "Phone is required.")]
    public string Phone { get; set; }
    [Required(ErrorMessage = "Address is required.")]
    public string Address { get; set; }
    [Required(ErrorMessage = "DateOfBirth is required.")]
    public string DateOfBirth { get; set; }
    [Required(ErrorMessage = "Gender is required.")]
    public string Gender { get; set; }

    public CustomerAccountCreated(string name, string email, string phone, string address, string dateOfBirth, string gender)
    {
        Name = name;
        Email = email;
        Phone = phone;
        Address = address;
        DateOfBirth = dateOfBirth;
        Gender = gender;
    }
}
