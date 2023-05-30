namespace CustomerManagement.EventModels;

public class CustomerInformationUpdated : CustomerBaseEvent
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? DateOfBirth { get; set; }
    public string? Gender { get; set; }
}
