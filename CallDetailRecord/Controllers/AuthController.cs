using CallDetailRecord.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<User> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto model)
    {
        var user = new User
        {
            UserName = model.Email,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
            PhoneNumber = model.PhoneNumber,
            Address = model.Address,
            PostCode = model.PostCode,
            City = model.City,
            Country = model.Country,
            DateOfBirth = model.DateOfBirth
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        // Assign default User Role
        var role = string.IsNullOrEmpty(model.Role) ? "User" : model.Role;
        var roleResult = await _userManager.AddToRoleAsync(user, "User");
        if (!roleResult.Succeeded)
        {
            return BadRequest(roleResult.Errors);
        }

        var token = await GenerateJwtToken(user);
        return Ok(new { token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
        {
            return Unauthorized("Invalid email or password.");
        }

        var token = GenerateJwtToken(user);

        return Ok(new { token?.Result });
    }

    private async Task<string> GenerateJwtToken( User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]));

        // Get user roles
        var roles = await _userManager.GetRolesAsync(user);

        // Create claims with roles
        var claims = new List<Claim>
        {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("firstName", user.FirstName ?? string.Empty),
                new Claim("lastName", user.LastName ?? string.Empty),
                new Claim("phoneNumber", user.PhoneNumber ?? string.Empty),
                new Claim("address", user.Address ?? string.Empty),
                new Claim("postCode", user.PostCode ?? string.Empty),
                new Claim("city", user.City ?? string.Empty),
                new Claim("country", user.Country ?? string.Empty),
                new Claim("dateOfBirth", user.DateOfBirth.ToString("yyyy-MM-dd") ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Add roles as claims
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiryInMinutes"])),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
