using InvoiceManagement.DataAccess;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var sqlConnectionString = builder.Configuration.GetConnectionString("DatabaseConnectionString");
Console.WriteLine("Hallo");
Console.WriteLine(sqlConnectionString);

//var serverVersion = ServerVersion.AutoDetect(sqlConnectionString);
var serverVersion = new MariaDbServerVersion(new Version(10, 11, 3));
Console.WriteLine(serverVersion);
builder.Services.AddDbContext<InvoiceManagementDBContext>(
    dbContextOptions => dbContextOptions.UseMySql(sqlConnectionString, serverVersion)
);
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();