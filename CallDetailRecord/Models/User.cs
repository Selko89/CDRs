using Microsoft.AspNetCore.Identity;

namespace CallDetailRecord.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        // PhoneNumber inherited from IdentityUser
        public string Address { get; set; }
        public string PostCode { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}
