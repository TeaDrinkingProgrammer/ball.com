namespace CustomerManagement.Messaging;

/// <summary>
/// RabbitMQ implementation of the MessagePublisher.
/// </summary>
public sealed class RabbitMQMessagePublisher : IMessagePublisher, IDisposable
{
    private const int DEFAULT_PORT = 5672;
    private readonly List<string> _hosts;
    private readonly int _port;
    private readonly string _username;
    private readonly string _password;
    private readonly string _queue;
    private IConnection _connection;
    private IModel _model;

    public RabbitMQMessagePublisher(string host, string username, string password, string queue)
        : this(new List<string>() { host }, username, password, queue, DEFAULT_PORT)
    {
    }

    public RabbitMQMessagePublisher(string host, string username, string password, string queue, int port)
        : this(new List<string>() { host }, username, password, queue, port)
    {
    }

    public RabbitMQMessagePublisher(IEnumerable<string> hosts, string username, string password, string queue)
        : this(hosts, username, password, queue, DEFAULT_PORT)
    {
    }

    public RabbitMQMessagePublisher(IEnumerable<string> hosts, string username, string password, string queue, int port)
    {
        _hosts = new List<string>(hosts);
        _port = port;
        _username = username;
        _password = password;
        _queue = queue;

        var logMessage = new StringBuilder();
        logMessage.AppendLine("Create RabbitMQ message-publisher instance using config:");
        logMessage.AppendLine($" - Hosts: {string.Join(',', _hosts.ToArray())}");
        logMessage.AppendLine($" - Port: {_port}");
        logMessage.AppendLine($" - UserName: {_username}");
        logMessage.AppendLine($" - Password: {new string('*', _password.Length)}");
        logMessage.Append($" - Queue: {_queue}");
        Console.WriteLine(logMessage.ToString());

        Connect();
    }

    /// <summary>
    /// Publish a message.
    /// </summary>
    /// <param name="messageType">Type of the message.</param>
    /// <param name="message">The message to publish.</param>
    public Task PublishMessageAsync(string messageType, object message)
    {
        return Task.Run(() =>
            {
                string data = MessageSerializer.Serialize(message);
                var body = Encoding.UTF8.GetBytes(data);
                IBasicProperties properties = _model.CreateBasicProperties();
                properties.Headers = new Dictionary<string, object> { { "MessageType", messageType } };
                _model.BasicPublish(exchange: "", routingKey: "customer", properties, body: body);
                //_model.BasicPublish(exchange: "", routingKey: "customer", body: body);
            });
    }

    private void Connect()
    {
        Policy
            .Handle<Exception>()
            .WaitAndRetry(9, r => TimeSpan.FromSeconds(5), (ex, ts) => { Console.WriteLine("Error connecting to RabbitMQ. Retrying in 5 sec."); })
            .Execute(() =>
            {
                var factory = new ConnectionFactory() { UserName = _username, Password = _password, Port = _port };
                factory.AutomaticRecoveryEnabled = true;
                _connection = factory.CreateConnection(_hosts);
                _model = _connection.CreateModel();
                _model.QueueDeclare(_queue, exclusive: false);
                //_model.QueueDeclare(_queue, durable: true, exclusive: false, autoDelete: false);
            });
    }

    public void Dispose()
    {
        _model?.Dispose();
        _model = null;
        _connection?.Dispose();
        _connection = null;
    }

    ~RabbitMQMessagePublisher()
    {
        Dispose();
    }
}