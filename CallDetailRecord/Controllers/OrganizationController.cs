using CallDetailRecord.Data;
using CallDetailRecord.Models;
using CallDetailRecord.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace CallDetailRecord.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationController : ControllerBase
    {
        private readonly AppDbContext _context;
        public OrganizationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Organization>>> GetAllOrganizations()
        {
            var organizations = await _context.Organizations.ToListAsync();
            return Ok(organizations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Organization>> GetOrganization(int id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            if(organization is null)
            {
                return NotFound("Organization not found!");
            }
            return Ok(organization);
        }

        [HttpPost]
        public async Task<ActionResult<Organization>> CreateOrganization(Organization organization)
        {
            if (_context.Organizations.Any(o => o.Email == organization.Email))
            {
                return BadRequest("Email er allerede i bruk.");
            }

            _context.Organizations.Add(organization);
            await _context.SaveChangesAsync();

            return Ok(organization);
        }

        [HttpPut]
        public async Task<ActionResult<Organization>> UpdateOrganization(Organization organization)
        {
            var dbOrg = await _context.Organizations.FindAsync(organization.OrganizationId);
            if (dbOrg is null)
            {
                return NotFound("Organization not found!");
            }

            dbOrg.PhoneNumber = organization.PhoneNumber;
            dbOrg.Email = organization.Email;
            dbOrg.Adress = organization.Adress;
            dbOrg.PostCode = organization.PostCode;
            dbOrg.Name = organization.Name;

            await _context.SaveChangesAsync();

            return Ok(organization);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteOrganization(int id)
        {
            var dbOrg = await _context.Organizations.FindAsync(id);
            if (dbOrg is null)
            {
                return NotFound("Organization not found!");
            }

            _context.Organizations.Remove(dbOrg);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
