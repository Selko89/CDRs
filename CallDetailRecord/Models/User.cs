using Microsoft.AspNetCore.Identity;

namespace CallDetailRecord.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
