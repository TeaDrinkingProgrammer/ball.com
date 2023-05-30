using InvoiceManagement.DataAccess;
using InvoiceManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace InvoiceManagement.Services;

public class InvoiceService : IInvoiceService
{
    private readonly InvoiceManagementDBContext _dbContext;

    public InvoiceService(InvoiceManagementDBContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> Delete(int id)
    {
        try
        {
            _dbContext.Invoices.Remove(
                new Invoice()
                {
                    Id = id
                }
            );

            return await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return 0;
        }
    }

    public async Task<IEnumerable<Invoice>> FindAll()
    {
        return await _dbContext.Invoices.ToListAsync();
    }

    public async Task<Invoice> FindOne(int id)
    {
        return await _dbContext.Invoices.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<int> Insert(Invoice Invoice)
    {
        _dbContext.Add(Invoice);
        return await _dbContext.SaveChangesAsync();
    }

    public async Task<int> Update(Invoice Invoice)
    {
        try
        {
            _dbContext.Update(Invoice);
            return await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return 0;
        }
    }
}