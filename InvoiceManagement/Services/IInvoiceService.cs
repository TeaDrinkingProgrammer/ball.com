using InvoiceManagement.Models;

namespace InvoiceManagement.Services;

public interface IInvoiceService
{
    Task<int> Delete(int id);
    Task<IEnumerable<Invoice>> FindAll();
    Task<Invoice> FindOne(int id);
    Task<int> Insert(Invoice Invoice);
    Task<int> Update(Invoice Invoice);
}