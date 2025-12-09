using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Models;

namespace UserDirectory.Api.Data;

public class AppDbContext : DbContext
{
    //*-----*
    //Session initiation with database
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    //*-----*
    //Mapping user entity to a db users
    public DbSet<User> Users { get; set; }
}
