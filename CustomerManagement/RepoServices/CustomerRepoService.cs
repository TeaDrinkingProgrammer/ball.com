using CustomerManagement.DataAccess;
using CustomerManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagement.Services;

public class CustomerRepoService : ICustomerRepoService
{
    private readonly CustomerManagementDBContext _dbContext;

    public CustomerRepoService(CustomerManagementDBContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Customer>> FindAll()
    {
        return await _dbContext.Customers.ToListAsync();
    }

    public async Task<Customer> FindOne(int id)
    {
        return await _dbContext.Customers.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<int> Insert(Customer customer)
    {
        _dbContext.Add(customer);
        return await _dbContext.SaveChangesAsync();
    }

    public async Task<int> Update(Customer customer)
    {
        try
        {
            _dbContext.Update(customer);
            return await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return 0;
        }
    }

    public async Task<int> Delete(Customer customer)
    {
        try
        {
            _dbContext.Customers.Remove(customer);

            return await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return 0;
        }
    }
}