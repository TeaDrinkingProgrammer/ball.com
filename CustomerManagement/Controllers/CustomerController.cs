using CustomerManagement.Events;
using CustomerManagement.Mappers;
using CustomerManagement.Messaging;
using CustomerManagement.Models;
using CustomerManagement.RequestModels;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace CustomerManagement.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class CustomerController : ControllerBase
{

    private readonly ILogger<CustomerController> _logger;
    private IMessagePublisher _messagePublisher;

    public CustomerController(ILogger<CustomerController> logger, IMessagePublisher messagePublisher)
    {
        _logger = logger;
        _messagePublisher = messagePublisher;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        return Ok();
        //return Ok(await _dbContext.Customers.ToListAsync());
    }

    [HttpGet]
    [Route("{customerId}", Name = "GetByCustomerId")]
    public async Task<IActionResult> GetByCustomerId(string customerId)
    {
        var customer = new Customer();
        //var customer = await _dbContext.Customers.FirstOrDefaultAsync(c => c.CustomerId == customerId);
        if (customer == null)
        {
            return NotFound();
        }
        return Ok(customer);
    }

    /// <summary>
    /// Creates a customer.
    /// </summary>
    /// <param name="requestObject"></param>
    /// <returns>A newly created customer</returns>
    /// <remarks>
    /// Sample request:
    ///
    ///     POST /customer
    ///     {
    ///        "customerId": "34134142",
    ///        "name": "Dave",
    ///        "email": "Dave@live.com",
    ///        "phone": "0612345678",
    ///        "address": "Avansstraat 1",
    ///        "dateOfBirth": "01-01-2000",
    ///        "gender": "Male"
    ///     }
    ///
    /// </remarks>
    /// <response code="201">If succeeded, returns the newly created item</response>
    /// <response code="400">If the request body is invalid</response>
    /// <response code="500">If the server is non-responsive</response>
    [HttpPost]
    public async Task<ActionResult<CustomerRequest>> CreateAsync(CustomerRequest requestObject)
    {
        Console.WriteLine("----------------test-----------------", requestObject);
        try
        {
            if (ModelState.IsValid)
            {
                // insert customer
                Customer customer = requestObject.MapToCustomer();
                //_dbContext.Customers.Add(customer);
                //await _dbContext.SaveChangesAsync();

                // send event
                CustomerCreated e = requestObject.MapToCustomerRegistered();
                await _messagePublisher.PublishMessageAsync(e.MessageType, e, "");

                // return result
                return CreatedAtRoute("GetByCustomerId", new { customerId = customer.CustomerId }, customer);
            }
            return BadRequest();
        }
        catch (Exception e)
        //catch (DbUpdateException)
        {
            ModelState.AddModelError("", "Unable to save changes. " +
                "Try again, and if the problem persists " +
                "see your system administrator.");
            Console.WriteLine(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
            throw;
        }
    }

    [HttpPut]
    [Route("{customerId}")]
    public async Task<IActionResult> UpdateAsync(string customerId, [FromBody] CustomerRequest requestObject)
    {
        try
        {
            if (ModelState.IsValid)
            {
                // update customer
                Customer customer = requestObject.MapToCustomer();
                //_dbContext.Customers.Update(customer);
                //await _dbContext.SaveChangesAsync();

                // return result
                return Ok(customer);
            }
            return BadRequest();
        }
        catch (Exception e)
        //catch (DbUpdateException)
        {
            ModelState.AddModelError("", "Unable to save changes. " +
                               "Try again, and if the problem persists " +
                                              "see your system administrator.");
            Console.WriteLine(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
            throw;
        }
    }

    [HttpDelete]
    [Route("{customerId}")]
    public async Task<IActionResult> DeleteAsync(string customerId)
    {
        try
        {
            // delete customer
            //var customer = await _dbContext.Customers.FirstOrDefaultAsync(c => c.CustomerId == customerId);
            //if (customer == null)
            //{
            //    return NotFound();
            //}
            //_dbContext.Customers.Remove(customer);
            //await _dbContext.SaveChangesAsync();

            // return result
            return Ok();
        }
        catch (Exception e)
        //catch (DbUpdateException)
        {
            ModelState.AddModelError("", "Unable to save changes. " +
                                              "Try again, and if the problem persists " +
                                                                                           "see your system administrator.");
            Console.WriteLine(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
            throw;
        }
    }
}