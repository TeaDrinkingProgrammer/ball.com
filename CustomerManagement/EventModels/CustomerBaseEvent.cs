namespace CustomerManagement.EventModels;

public abstract class CustomerBaseEvent
{
    public readonly string EventType;

    public CustomerBaseEvent()
    {
        EventType = GetType().Name;
    }
}