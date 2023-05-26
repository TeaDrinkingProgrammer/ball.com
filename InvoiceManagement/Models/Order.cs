namespace InvoiceManagement.Models;

public class Order
{
    public int Id { get; set; }
    public Customer Customer { get; set; }
    public List<Product> Products { get; set; }
    public ShippingStatus ShippingStatus { get; set; }
    public double TotalAmount { get; set; }
    public string PaymentMethod { get; set; }
    public string ShippingAddress { get; set; }
}