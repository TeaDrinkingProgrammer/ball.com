using RabbitMQ.Client.Events;
using System.Text;
using System.Threading.Channels;
using System;
using Polly;
using RabbitMQ.Client;
using InvoiceManagement.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace InvoiceManagement.Rabbitmq
{
    public class MessageReceiverOrder : DefaultBasicConsumer, IBasicConsumer
    {
        private readonly IModel _channel;
        private readonly InvoiceManagementDBContext _dbContext;

        public MessageReceiverOrder(IModel channel, InvoiceManagementDBContext dbContext)
        {
            _channel = channel;
            _dbContext = dbContext;
        }

        public override void HandleBasicDeliver(
            string consumerTag,
            ulong deliveryTag,
            bool redelivered,
            string exchange,
            string routingKey,
            IBasicProperties properties,
            ReadOnlyMemory<byte> body
        )
        {
            Console.WriteLine($"Consuming Message");
            Console.WriteLine(string.Concat("Message received from the exchange ", exchange));
            Console.WriteLine(string.Concat("Consumer tag: ", consumerTag));
            Console.WriteLine(string.Concat("Delivery tag: ", deliveryTag));
            Console.WriteLine(string.Concat("Routing tag: ", routingKey));
            Console.WriteLine(string.Concat("Message: ", Encoding.UTF8.GetString(body.ToArray())));

            _channel.BasicAck(deliveryTag, false);
        }
    }
}
