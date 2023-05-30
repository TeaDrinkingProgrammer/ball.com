namespace CustomerManagement.Messaging;

public interface IMessagePublisher
{
    /// <summary>
    /// Publish a message.
    /// </summary>
    /// <param name="messageType">Type of the message.</param>
    /// <param name="message">The message to publish.</param>
    Task PublishMessageAsync(string messageType, object message);
}