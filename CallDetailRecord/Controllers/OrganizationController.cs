using CallDetailRecord.Models;
using CallDetailRecord.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CallDetailRecord.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<Organization>>> GetAllOrganizations()
        {
            var org = new List<Organization> {
                new Organization
                {
                    OrganizationId = 1,
                    Name = "Test org",
                    Adress = "Test adress",
                    Email = "Test@gmail.com",
                    PhoneNumber = "41088447",
                    PostCode = 5135
                },
                new Organization
                {
                    OrganizationId = 2,
                    Name = "Test org2",
                    Adress = "Test adress2",
                    Email = "Test2@gmail.com",
                    PhoneNumber = "41088448",
                    PostCode = 5135
                }
            };
            return Ok(org);
        }
    }
}
