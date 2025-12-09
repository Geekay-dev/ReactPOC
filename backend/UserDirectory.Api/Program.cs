using UserDirectory.Api.Data;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

// --- CORS: allow frontend dev server (Vite) ---
var allowedOrigins = builder.Configuration.GetValue<string>("AllowedCorsOrigins")
                     ?? "http://localhost:5173";

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalDev", policy =>
    {
        policy
            .WithOrigins(allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithExposedHeaders("X-Total-Count", "WWW-Authenticate", "Pagination");
    });
});


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
//*-----*
//Register DB Context
//builder.Services.AddDbContext<AppDbContext>(options =>
   // options.UseSqlite("Data Source=../data/app.db"));
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=../../data/app.db"));

// Allow the React dev server to call this API during development
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Vite dev server origin
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowLocalDev");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// --- enable CORS here ---
//app.UseCors(MyAllowSpecificOrigins);
// --- end ---
app.MapControllers();

app.Run();
/*
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
*/