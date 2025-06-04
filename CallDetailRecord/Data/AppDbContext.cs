using CallDetailRecord.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CallDetailRecord.Data
{
    //public class AppDbContext: DbContext old
    public class AppDbContext: IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Organization> Organizations { get; set; }
    }
}
