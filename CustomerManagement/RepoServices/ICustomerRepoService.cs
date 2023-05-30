using CustomerManagement.Models;

namespace CustomerManagement.Services;

public interface ICustomerRepoService
{
    Task<IEnumerable<Customer>> FindAll();
    Task<Customer> FindOne(int id);
    Task<int> Insert(Customer customer);
    Task<int> Update(Customer customer);
    Task<int> Delete(Customer customer);
}