public interface IMessagePublisher
{
    public void SendMessage<T>(T message);
}
