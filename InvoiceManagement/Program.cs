using InvoiceManagement.DataAccess;
using InvoiceManagement.Rabbitmq;
using InvoiceManagement.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

var builder = WebApplication.CreateBuilder(args);

ConnectionFactory connectionFactory = new ConnectionFactory
{
    HostName = "localhost",
    UserName = "guest",
    Password = "guest",
};
var connection = connectionFactory.CreateConnection();
var channel = connection.CreateModel();
channel.BasicQos(0, 1, false);
channel.QueueDeclare("product", exclusive: false);
channel.QueueDeclare("customer", exclusive: false);
channel.QueueDeclare("order", exclusive: false);
MessageReceiver messageReceiver = new MessageReceiver(channel);
var consumer = new EventingBasicConsumer(channel);
channel.BasicConsume("product", false, messageReceiver);
channel.BasicConsume("customer", false, messageReceiver);
channel.BasicConsume("order", false, messageReceiver);

// Add services to the container.
var sqlConnectionString = builder.Configuration.GetConnectionString("DatabaseConnectionString");

//var serverVersion = ServerVersion.AutoDetect(sqlConnectionString);
var serverVersion = new MariaDbServerVersion(new Version(10, 11, 3));
builder.Services.AddDbContext<InvoiceManagementDBContext>(
    dbContextOptions => dbContextOptions.UseMySql(sqlConnectionString, serverVersion)
);
builder.Services.AddScoped<IMessagePublisher, MessagePublisher>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddControllers();

//Tutorial rabbitmq
//https://www.tutlane.com/tutorial/rabbitmq/csharp-read-messages-from-rabbitmq-queue

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
