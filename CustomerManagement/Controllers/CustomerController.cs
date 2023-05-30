using CustomerManagement.EventModels;
using CustomerManagement.Mappers;
using CustomerManagement.Messaging;
using CustomerManagement.Models;
using CustomerManagement.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagement.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class CustomerController : ControllerBase
{

    private readonly ILogger<CustomerController> _logger;
    private readonly IMessagePublisher _messagePublisher;
    private readonly ICustomerRepoService _customerRepoService;

    public CustomerController(ILogger<CustomerController> logger, IMessagePublisher messagePublisher, ICustomerRepoService customerRepoService)
    {
        _logger = logger;
        _messagePublisher = messagePublisher;
        _customerRepoService = customerRepoService;
    }

    /// <summary>
    /// Gets customers
    /// </summary>
    /// <returns>A list of customers</returns>
    /// <remarks>
    /// Sample request:
    ///
    ///     No request body needed
    ///
    /// </remarks>
    /// <response code="200">If succeeded, returns all items</response>
    /// <response code="500">If the server is non-responsive</response>
    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        try
        {
            return Ok(await _customerRepoService.FindAll());
        }
        catch (DbUpdateException e)
        {
            ModelState.AddModelError("", "Unable to get items. " +
                "Try again, and if the problem persists " +
                "see your system administrator.");
            Console.WriteLine(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
            throw;
        }
    }

    /// <summary>
    /// Gets a customer
    /// </summary>
    /// <param name="customerId"></param>
    /// <returns>A customer</returns>
    /// <remarks>
    /// Sample request:
    ///
    ///     GET /customer
    ///     {
    ///        "id": 1
    ///     }
    ///
    /// </remarks>
    /// <response code="200">If succeeded, returns item</response>
    /// <response code="400">If the item is not found</response>
    /// <response code="500">If the server is non-responsive</response>
    [HttpGet]
    [Route("{customerId}", Name = "GetByCustomerId")]
    public async Task<IActionResult> GetByCustomerId(int customerId)
    {
        try
        {
            var customer = await _customerRepoService.FindOne(customerId);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        }
        catch (DbUpdateException e)
        {
            ModelState.AddModelError("", "Unable to get item. " +
                "Try again, and if the problem persists " +
                "see your system administrator.");
            Console.WriteLine(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
            throw;
        }
    }

    /// <summary>
    /// Creates a customer
    /// </summary>
    /// <param name="requestObject"></param>
    /// <returns>A newly created customer</returns>
    /// <remarks>
    /// Sample request:
    ///
    ///     POST /customer
    ///     {
    ///        "name": "Dave",
    ///        "email": "Dave@live.com",
    ///        "phone": "0612345678",
    ///        "address": "Avansstraat 1",
    ///        "dateOfBirth": "01-01-2000",
    ///        "gender": "Male"
    ///     }
    ///
    /// </remarks>
    /// <response code="200">If succeeded, returns the newly created item</response>
    /// <response code="400">If the request body is invalid</response>
    /// <response code="500">If the server is non-responsive</response>
    [HttpPost]
    public async Task<ActionResult<CustomerAccountCreated>> CreateAsync(CustomerAccountCreated requestObject)
    {
        try
        {
            if (ModelState.IsValid)
            {
                Customer customer = requestObject.MapCustomerAccountCreatedToCustomer();
                var customerId = await _customerRepoService.Insert(customer);

                await _messagePublisher.PublishMessageAsync(requestObject.EventType, customer);

                return Ok(customer);
            }
            return BadRequest();
        }
        catch (DbUpdateException e)
        {
            ModelState.AddModelError("", "Unable to save changes. " +
                "Try again, and if the problem persists " +
                "see your system administrator.");
            Console.WriteLine(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
            throw;
        }
    }

    /// <summary>
    /// Updates a customer (on single field)
    /// </summary>
    /// <param name="customerId"></param>
    /// <param name="requestObject"></param>
    /// <returns>The updated customer</returns>
    /// <remarks>
    /// Sample request:
    ///
    ///     PUT /customer/1
    ///     {
    ///        "name": "Dave2"
    ///     }
    ///     
    ///     or
    ///     
    ///     
    ///     PUT /customer/1
    ///     {
    ///        "email": "Dave2@live.com"
    ///     }
    ///
    /// </remarks>
    /// <response code="200">If succeeded, returns the updated item</response>
    /// <response code="400">If the request body is invalid</response>
    /// <response code="500">If the server is non-responsive</response>
    [HttpPut]
    [Route("{customerId}")]
    public async Task<ActionResult<CustomerInformationUpdated>> UpdateAsync(int customerId, CustomerInformationUpdated requestObject)
    {
        try
        {
            if (ModelState.IsValid)
            {
                Customer customer = await _customerRepoService.FindOne(customerId);

                if (customer == null)
                {
                    return NotFound();
                }

                Customer customerConverted = requestObject.MapCustomerInformationUpdatedToCustomer();
                if (requestObject.Name != null) customer.Name = customerConverted.Name;
                if (requestObject.Email != null) customer.Email = customerConverted.Email;
                if (requestObject.Phone != null) customer.Phone = customerConverted.Phone;
                if (requestObject.Address != null) customer.Address = customerConverted.Address;
                if (requestObject.DateOfBirth != null) customer.DateOfBirth = customerConverted.DateOfBirth;
                if (requestObject.Gender != null) customer.Gender = customerConverted.Gender;
                customer.UpdatedAt = DateTime.Now;


                await _customerRepoService.Update(customer);

                await _messagePublisher.PublishMessageAsync(requestObject.EventType, customer);

                return Ok(customer);
            }
            return BadRequest();
        }
        catch (DbUpdateException e)
        {
            ModelState.AddModelError("", "Unable to save changes. " +
                               "Try again, and if the problem persists " +
                                              "see your system administrator.");
            Console.WriteLine(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
            throw;
        }
    }

    /// <summary>
    /// Deletes a customer
    /// </summary>
    /// <param name="customerId"></param>
    /// <returns>A deletion confirmation</returns>
    /// <remarks>
    /// Sample request:
    ///
    ///     DELETE /customer/1
    ///     
    ///     No request body needed
    ///
    /// </remarks>
    /// <response code="200">If succeeded, returns a deletion confirmation body</response>
    /// <response code="400">If the customer is not found</response>
    /// <response code="500">If the server is non-responsive</response>
    [HttpDelete]
    [Route("{customerId}")]
    public async Task<IActionResult> DeleteAsync(int customerId)
    {
        try
        {
            var customer = await _customerRepoService.FindOne(customerId);
            if (customer == null)
            {
                return NotFound();
            }
            await _customerRepoService.Delete(customer);

            await _messagePublisher.PublishMessageAsync("CustomerAccountDeleted", $"Deleted customer with Id: {customerId}");

            return Ok($"Message: User with id {customerId} is deleted.");
        }
        catch (DbUpdateException e)
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