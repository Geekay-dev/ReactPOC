//*-----*
//Creating userModel
namespace UserDirectory.Api.Models;
//*-----*
//Mapping to a table named users
public class User
{
    //*-----*
    //Primary key
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Age { get; set; }

    public string City { get; set; } = null!;

    public string State { get; set; } = null!;

    public string Pincode { get; set; } = null!;
}
