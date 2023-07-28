using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;


namespace BOX.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class SupplierOrderController : ControllerBase
	{
		private readonly IRepository _repository;

		public SupplierOrderController(IRepository repository)
		{
			_repository = repository;
		}

		//-------------------------------------------------- Get All Supplier Orders --------------------------------------------------
		[HttpGet]
		[Route("GetAllSupplierOrders")]
		public async Task<IActionResult> GetAllSupplierOrders()
		{
			try
			{
				var supOrders = await _repository.GetAllSupplierOrdersAsync();

				List<SupplierOrderViewModel> supplierOrderViewModels = new List<SupplierOrderViewModel>(); //create array of VMs
				foreach (var order in supOrders)
				{

					//get all customer order lines associated with this order and create array from them
					List<SupplierOrderLineViewModel> supplierOrderLineList = new List<SupplierOrderLineViewModel>();
					var orderLines = await _repository.GetSupplierOrderLinesByOrderAsync(order.SupplierOrderID);

					//put all customer order lines for this specific customer order in a list for the customer order VM
					foreach (var ol in orderLines)
					{

						SupplierOrderLineViewModel solvm = new SupplierOrderLineViewModel
						{
							Supplier_OrderLineID = ol.Supplier_Order_LineID,
							Supplier_OrderID = ol.SupplierOrderID,
							Fixed_ProductID = ol.FixedProductID,
							Raw_MaterialID = ol.RawMaterialID,
							Supplier_ReturnID = ol.SupplierReturnID,
							Quantity = ol.Quantity
						};
						supplierOrderLineList.Add(solvm);

					}

					SupplierOrderViewModel eVM = new SupplierOrderViewModel()
					{
						SupplierOrderID = order.SupplierOrderID,
						SupplierID = orderLines[0].SupplierID,

						Date = order.Date,
						SupplierOrders = supplierOrderLineList
					};
					supplierOrderViewModels.Add(eVM);
				}


				return Ok(supplierOrderViewModels);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}

		}


		//-------------------------------------------------- Get Supplier Order By ID ------------------------------------------------
		[HttpGet]
		[Route("GetSupplierOrder/{supplierOrderId}")]
		public async Task<IActionResult> GetSupplierOrder(int supplierOrderId)
		{
			try
			{
				var order = await _repository.GetSupplierOrderAsync(supplierOrderId);
				if (order == null) return NotFound("The Supplier Order does not exist on the B.O.X System");

				var orderLines = await _repository.GetSupplierOrderLinesByOrderAsync(order.SupplierOrderID); //get all order lines associated with this order
				if (orderLines == null) return NotFound("The Supplier Order does not exist on the B.O.X System"); //an order must have at least 1 line

				//create list from estimate lines
				List<SupplierOrderLineViewModel> orderLineList = new List<SupplierOrderLineViewModel>();

				//put all estimate lines for this specific estimate in the list
				foreach (var ol in orderLineList)
				{
					//when I display a specific estimate, I also display the fixed product unit price and description
					var fixedProduct = await _repository.GetFixedProductAsync(ol.Fixed_ProductID);

					SupplierOrderLineViewModel slvm = new SupplierOrderLineViewModel()
					{
						Supplier_OrderLineID = ol.Supplier_OrderLineID,
						Supplier_OrderID = ol.Supplier_OrderID,
						Supplier_ReturnID = ol.Supplier_ReturnID,
						Fixed_ProductID = ol.Fixed_ProductID,
						Raw_Material_Description = ol.Raw_Material_Description,
						FixedProduct_Description = ol.FixedProduct_Description,
						Quantity = ol.Quantity

					};
					orderLineList.Add(slvm);
				}

				var SupplierOrderViewModel = new SupplierOrderViewModel
				{
					SupplierOrderID = order.SupplierOrderID,
					SupplierID = orderLines[0].SupplierID,
					Date = order.Date,
					SupplierOrders = orderLineList
				};

				return Ok(SupplierOrderViewModel); //return estimate VM which contains estimate info plus estimate lines info in list format
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		[HttpGet]
		[Route("GetOrderBySupplier/{supplierId}")]
		public async Task<IActionResult> GetOrderBySupplier(int supplierId)
		{
			try
			{
				List<SupplierOrderViewModel> supplierOrdere = new List<SupplierOrderViewModel>(); //create list to return
				var orderLines = await _repository.GetSupplierOrderLinesBySupplierAsync(supplierId); //get all estimate lines for this customer

				/*What I want to do: get all the estimates a customer has ever made in a list of estimate VMs
                But, the estimate entity doesn't contain the customerID, estimate lines does because it's the associative entity inbetween
                so I get all the estimate lines made by a customer and I want to sort them into estimates i.e. estimateVM 1 should 
                contain only its estimate lines. To do that, I first find out how many estimates there are, using the distinct() 
                method and create estimateVMs for them. Then I loop through each estimate line and sort them into their estimates.
                Hopefully this make sense to future Charis */


				List<SupplierOrderLineViewModel> allSupplierOrderLines = new List<SupplierOrderLineViewModel>();
				//put all the customer's estimate lines in VM
				foreach (var ol in allSupplierOrderLines)
				{

					var fixedProduct = await _repository.GetFixedProductAsync(ol.Fixed_ProductID);

					SupplierOrderLineViewModel slVM = new SupplierOrderLineViewModel
					{
						Supplier_OrderLineID = ol.Supplier_OrderLineID,
						Supplier_OrderID = ol.Supplier_OrderID,
						Fixed_ProductID = ol.Fixed_ProductID,
						Raw_MaterialID=ol.Raw_MaterialID,
						FixedProduct_Description = ol.FixedProduct_Description,
						Raw_Material_Description =ol.Raw_Material_Description,
						Quantity = ol.Quantity
					};
					allSupplierOrderLines.Add(slVM);
				}

				//Create estimate VMs for all the customer's estimates then group estimate lines into the estimate VMs
				var distinctOrderLines = allSupplierOrderLines.Select(el => el.Supplier_OrderID).Distinct(); //returns all distinct estimate IDs
				int orderCount = distinctOrderLines.Count(); //count how many order there are

				foreach (var orderID in distinctOrderLines) //get all the estimates using the distinct estimateIDs and estimateVM
				{
					Supplier_Order order = await _repository.GetSupplierOrderAsync(orderID);

					SupplierOrderViewModel soVM = new SupplierOrderViewModel
					{
						SupplierOrderID = order.SupplierOrderID,
						SupplierID = orderLines[0].SupplierID,
						Date = order.Date,
						SupplierOrders = allSupplierOrderLines.Where(el => el.Supplier_OrderID == orderID).ToList() //get all estimate lines for this estimate
					};

					supplierOrdere.Add(soVM);
				}

				return Ok(supplierOrdere);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		//-------------------------------------------------- Create Customer Order  ----------------------------------------------------
		[HttpPost]
		[Route("AddSupplierOrder")]
		public async Task<IActionResult> AddSupplierOrder([FromBody] SupplierOrderViewModel supplierOrderViewModel)
		{
			// Create a new instance of Customer from the view model
			var order = new Supplier_Order
			{
				//hard coded values are constant or can only ever be 1 in the DB. It'll be fine as long as we remember to change it on each person's machine and 1ce and for all on the final server
				Date = supplierOrderViewModel.Date

			}; //do not add value for estimateID manually else SQL won't auto generate it


			try
			{

				_repository.Add(order); // Save the order in the repository

				//get all estimate lines from the VM and put in estimate_line entity
				for (int i = 0; i < supplierOrderViewModel.SupplierOrders.Count(); i++)
				{
					var orderLineVM = supplierOrderViewModel.SupplierOrders[i];

					/*the estimate_line entity's ID is concatenated using customer ID, estimate ID and estimate line ID. An 
                    estimate with ID 5 by customer with ID 16, and 2 estimate lines will have 7 estimate_line records with IDs like so:
                        estimate ID: 5, customer ID: 16, and estimate line ID: 1
                        estimate ID: 5, customer ID: 16, and estimate line ID: 2
                    a new estimate by customer 16 with 3 estimate lines will be
                        estimate ID: 6, customer ID: 16, and estimate line ID: 1
                        estimate ID: 6, customer ID: 16, and estimate line ID: 2
                        estimate ID: 6, customer ID: 16, and estimate line ID: 3 */
					Supplier_OrderLine orderLineRecord = new Supplier_OrderLine
					{
						Supplier_Order_LineID = i + 1, //e.g. 1, then 2, 3, etc.
						SupplierID = supplierOrderViewModel.SupplierID,
						RawMaterialID=orderLineVM.Raw_MaterialID,
						SupplierOrderID = order.SupplierOrderID, //it's NB to save the estimate 1st so SQL generates its ID to use in the estimate line concatenated ID
						Supplier_Order = order,
						SupplierReturnID=orderLineVM.Supplier_ReturnID,
						FixedProductID = orderLineVM.Fixed_ProductID,
						Quantity = orderLineVM.Quantity
					};

					_repository.Add(orderLineRecord); //save estimate line in DB
				}

				// Save changes in the repository
				await _repository.SaveChangesAsync();

				return Ok(supplierOrderViewModel);
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services. " + ex.Message + " has inner exception of " + ex.InnerException);
			}
		}

	}
}
