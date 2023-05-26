namespace InvoiceManagement.Rabbitmq
{
    public interface IMessageReciever
    {
        public void RecieveMessage<T>(T message);
    }
}
