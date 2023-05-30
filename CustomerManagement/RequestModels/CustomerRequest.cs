using CustomerManagement.Messaging;

namespace CustomerManagement.RequestModels;

public class CustomerRequest : Command
{
    public readonly string CustomerId;
    public readonly string Name;
    public readonly string Email;
    public readonly string Phone;
    public readonly string Address;
    public readonly string DateOfBirth;
    public readonly string Gender;

    public CustomerRequest(string customerId, string name, string email, string phone, string address,
        string dateOfBirth, string gender)
    {
        CustomerId = customerId;
        Name = name;
        Email = email;
        Phone = phone;
        Address = address;
        DateOfBirth = dateOfBirth;
        Gender = gender;
        base.MessageId = Guid.NewGuid();
    }
}
