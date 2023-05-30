using InvoiceManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace InvoiceManagement.DataAccess;

public class InvoiceManagementDBContext: DbContext
{
    public InvoiceManagementDBContext(DbContextOptions<InvoiceManagementDBContext> options)
        : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Invoice> Invoices { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Product>().HasKey(m => m.Id);
        builder.Entity<Product>().ToTable("Product");
        builder.Entity<Customer>().HasKey(m => m.Id);
        builder.Entity<Customer>().ToTable("Customer");
        builder.Entity<Order>().HasKey(m => m.Id);
        builder.Entity<Order>().ToTable("Order");
        builder.Entity<Invoice>().HasKey(m => m.Id);
        builder.Entity<Invoice>().ToTable("Invoice");
        base.OnModelCreating(builder);
    }
}