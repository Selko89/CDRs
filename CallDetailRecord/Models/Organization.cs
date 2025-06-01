using System.ComponentModel.DataAnnotations;

namespace CallDetailRecord.Models
{
    public class Organization
    {
        public int OrganizationId { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Adress { get; set; }

        public int? PostCode { get; set; }

        [Required]
        public required string Email { get; set; }

        public string? PhoneNumber { get; set; }
    }
}
