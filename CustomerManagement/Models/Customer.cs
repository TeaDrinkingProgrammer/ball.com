namespace CustomerManagement.Models;

public class Customer
{
    //Write properties for the entities below
    //Customer ID: De identificatie van de klant die de bestelling heeft geplaatst.
    //Name: De naam van de klant.
    //Email: Het e-mailadres van de klant.
    //Phone: Het telefoonnummer van de klant.
    //Address: Het adres van de klant.
    //DateOfBirth: De geboortedatum van de klant.
    //Gender: Het geslacht van de klant.
    //CreatedAt: De datum en tijd waarop de klant is aangemaakt.
    //UpdatedAt: De datum en tijd waarop de klant voor het laatst is bijgewerkt.

    public string CustomerId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}