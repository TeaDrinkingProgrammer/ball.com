using InventoryManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.DataAccess;

public class InventoryManagementContextDB : DbContext
{
    public InventoryManagementContextDB(DbContextOptions<InventoryManagementContextDB> options)
        : base(options) { }

    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Product>().HasKey(m => m.Id);
        builder.Entity<Product>().ToTable("Product");
        base.OnModelCreating(builder);
    }
}
