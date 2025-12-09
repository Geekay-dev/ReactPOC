using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Data;
using UserDirectory.Api.Models;

namespace UserDirectory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAll()
    {
        var users = await _db.Users.AsNoTracking().ToListAsync();
        return Ok(users);
    }

    // GET: api/users/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<User>> GetById(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    // POST: api/users
    [HttpPost]
    public async Task<ActionResult<User>> Create([FromBody] User input)
    {
        // Basic server-side validation
        if (string.IsNullOrWhiteSpace(input.Name) || input.Name.Length > 100)
            return BadRequest("Name is required and must be 1-100 characters.");
        if (input.Age < 0 || input.Age > 120)
            return BadRequest("Age must be between 0 and 120.");
        if (string.IsNullOrWhiteSpace(input.Pincode) || input.Pincode.Length < 4 || input.Pincode.Length > 10)
            return BadRequest("Pincode must be 4-10 characters.");

        var user = new User
        {
            Name = input.Name.Trim(),
            Age = input.Age,
            City = input.City?.Trim() ?? string.Empty,
            State = input.State?.Trim() ?? string.Empty,
            Pincode = input.Pincode.Trim()
        };

        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();

        // Returns 201 Created with location header pointing to GET by id
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    // PUT: api/users/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] User input)
    {
        if (id != input.Id) return BadRequest("Route id and body id must match.");

        // Basic validation (same rules as POST)
        if (string.IsNullOrWhiteSpace(input.Name) || input.Name.Length > 100)
            return BadRequest("Name is required and must be 1-100 characters.");
        if (input.Age < 0 || input.Age > 120)
            return BadRequest("Age must be between 0 and 120.");
        if (string.IsNullOrWhiteSpace(input.Pincode) || input.Pincode.Length < 4 || input.Pincode.Length > 10)
            return BadRequest("Pincode must be 4-10 characters.");

        var existing = await _db.Users.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = input.Name.Trim();
        existing.Age = input.Age;
        existing.City = input.City?.Trim() ?? string.Empty;
        existing.State = input.State?.Trim() ?? string.Empty;
        existing.Pincode = input.Pincode.Trim();

        _db.Users.Update(existing);
        await _db.SaveChangesAsync();

        // 204 No Content is standard for successful PUT with no body
        return NoContent();
    }

    // DELETE: api/users/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _db.Users.FindAsync(id);
        if (existing == null) return NotFound();

        _db.Users.Remove(existing);
        await _db.SaveChangesAsync();

        // 204 No Content indicates successful delete
        return NoContent();
    }
}