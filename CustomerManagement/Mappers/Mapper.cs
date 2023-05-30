using CustomerManagement.EventModels;
using CustomerManagement.Models;

namespace CustomerManagement.Mappers;

public static class Mapper
{
    public static Customer MapCustomerAccountCreatedToCustomer(this CustomerAccountCreated command) => new Customer
    {
        Name = command.Name,
        Email = command.Email,
        Phone = command.Phone,
        Address = command.Address,
        DateOfBirth = DateOnly.Parse(command.DateOfBirth),
        Gender = (Gender)Enum.Parse(typeof(Gender), command.Gender)
    };


    public static Customer MapCustomerInformationUpdatedToCustomer(this CustomerInformationUpdated command)
    {
        var customer = new Customer();

        if (command.Name != null) customer.Name = command.Name;
        if (command.Email != null) customer.Email = command.Email;
        if (command.Phone != null) customer.Phone = command.Phone;
        if (command.Address != null) customer.Name = command.Address;
        if (command.DateOfBirth != null) customer.DateOfBirth = DateOnly.Parse(command.DateOfBirth);
        if (command.Gender != null) customer.Gender = (Gender)Enum.Parse(typeof(Gender), command.Gender);

        return customer;
    }
}
