using CallDetailRecord.Services;
using Microsoft.AspNetCore.Mvc;

namespace CallDetailRecord.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CDRController : ControllerBase
    {
        private readonly CDRService _cdrService;

        public CDRController(CDRService cdrService)
        {
            _cdrService = cdrService;
        }
        [HttpGet]
        public async Task <ActionResult<string>> ParseJsonData()
        {
            var result = _cdrService.ParseCDRJson();
            return Ok(result);
        }
    }
}
