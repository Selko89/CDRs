using CallDetailRecord.Models;
using Microsoft.EntityFrameworkCore;

namespace CallDetailRecord.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Organization> Organizations { get; set; }
    }
}
