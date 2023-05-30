namespace InvoiceManagement.Models;

public class Invoice
{
    public int Id { get; set; }
    public Order Order { get; set; }
    public double Amount { get; set; }
    public PayementStatus PaymentStatus { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

}