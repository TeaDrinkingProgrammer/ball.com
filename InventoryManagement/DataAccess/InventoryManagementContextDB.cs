using InventoryManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.DataAccess;

public class InventoryManagementContaxtDB : DbContext
{
    public InventoryManagementContaxtDB(DbContextOptions<InventoryManagementContaxtDB> options) : base(options)
    {

    }
    
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Product>().HasKey(m => m.ProductId);
        builder.Entity<Product>().ToTable("Customer");
        base.OnModelCreating(builder);
    }

    public void MigrateDB()
    {
        Policy
            .Handle<Exception>()
            .WaitAndRetry(10, r => TimeSpan.FromSeconds(10))
            .Execute(() => Database.Migrate());
    }
}