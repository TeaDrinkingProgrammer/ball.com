using CustomerManagement.DataAccess;
using CustomerManagement.Messaging.Configuration;
using CustomerManagement.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

var sqlConnectionString = builder.Configuration.GetConnectionString("DatabaseConnectionString");

var serverVersion = new MariaDbServerVersion(new Version(10, 11, 3));
builder.Services.AddDbContext<CustomerManagementDBContext>(
    dbContextOptions => dbContextOptions.UseMySql(sqlConnectionString, serverVersion)
);

builder.Services.AddScoped<ICustomerRepoService, CustomerRepoService>();

// add messagepublisher
builder.Services.UseRabbitMQMessagePublisher(builder.Configuration);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Version = "v1",
            Title = "Customer API microservice Ball.com",
            Description = "An ASP.NET Core Web API for managing customers for Ball.com",
            TermsOfService = new Uri("https://example.com/terms"),
            Contact = new OpenApiContact
            {
                Name = "Ball.com Contact",
                Url = new Uri("https://example.com/contact")
            },
            License = new OpenApiLicense
            {
                Name = "Ball.com License",
                Url = new Uri("https://example.com/license")
            }
        });

        // using System.Reflection;
        var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
    }
    );

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
app.UseSwaggerUI();
//}

using (var scope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
{
    scope.ServiceProvider.GetService<CustomerManagementDBContext>().MigrateDB();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
