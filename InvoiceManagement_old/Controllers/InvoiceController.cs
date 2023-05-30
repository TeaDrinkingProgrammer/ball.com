using InvoiceManagement.Models;
using InvoiceManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceManagement.Controllers;

[ApiController]
[Route("[controller]")]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;
    private readonly IMessagePublisher _messagePublisher;

    public InvoiceController(IInvoiceService invoiceService, IMessagePublisher messagePublisher)
    {
        _invoiceService = invoiceService;
        _messagePublisher = messagePublisher;
    }

    [HttpGet]
    public async Task<IEnumerable<Invoice>> Get()
    {
        _messagePublisher.SendMessage("hello");
        return await _invoiceService.FindAll();
    }

    [HttpGet("{id}", Name = "FindOne")]
    public async Task<ActionResult<Invoice>> Get(int id)
    {
        var result = await _invoiceService.FindOne(id);
        if (result != default)
            return Ok(result);
        else
            return NotFound();
    }

    [HttpPost]
    public async Task<ActionResult<Invoice>> Insert(Invoice dto)
    {
        if (dto.Id != null)
        {
            return BadRequest("Id cannot be set for insert action.");
        }

        var id = await _invoiceService.Insert(dto);
        if (id != default)
        {
            _messagePublisher.SendMessage(id);
            return CreatedAtRoute("FindOne", new { id = id }, dto);
        }
        else
            return BadRequest();
    }

    [HttpPut]
    public async Task<ActionResult<Invoice>> Update(Invoice dto)
    {
        if (dto.Id == null)
        {
            return BadRequest("Id should be set for insert action.");
        }

        var result = await _invoiceService.Update(dto);
        if (result > 0)
            return NoContent();
        else
            return NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Invoice>> Delete(int id)
    {
        var result = await _invoiceService.Delete(id);
        if (result > 0)
            return NoContent();
        else
            return NotFound();
    }
}
