using CustomerManagement.Events;
using CustomerManagement.Models;
using CustomerManagement.RequestModels;

namespace CustomerManagement.Mappers;

public static class Mapper
{
    public static CustomerCreated MapToCustomerRegistered(this CustomerRequest command) => new CustomerCreated
    (
        System.Guid.NewGuid(),
        command.CustomerId,
        command.Name,
        command.Email,
        command.Phone,
        command.Address,
        command.DateOfBirth,
        command.Gender
    );

    public static Customer MapToCustomer(this CustomerRequest command) => new Customer
    {
        CustomerId = command.CustomerId,
        Name = command.Name,
        Email = command.Email,
        Phone = command.Phone,
        Address = command.Address,
        DateOfBirth = DateOnly.Parse(command.DateOfBirth),
        Gender = (Gender) Enum.Parse(typeof(Gender), command.Gender)
    };
}
