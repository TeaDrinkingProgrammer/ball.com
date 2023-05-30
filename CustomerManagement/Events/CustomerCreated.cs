using CustomerManagement.Messaging;

namespace CustomerManagement.Events;

public class CustomerCreated : Event
{
    public readonly string CustomerId;
    public readonly string Name;
    public readonly string Email;
    public readonly string Phone;
    public readonly string Address;
    public readonly string DateOfBirth;
    public readonly string Gender;

    public CustomerCreated(Guid messageId, string customerId, string name, string email, string phone, string address,
        string dateOfBirth, string gender) : base(messageId)
    {
        CustomerId = customerId;
        Name = name;
        Email = email;
        Phone = phone;
        Address = address;
        DateOfBirth = dateOfBirth;
        Gender = gender;
    }
}
