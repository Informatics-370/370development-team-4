using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;
//QR Code Generation
using QRCoder;
using System.Drawing;
using System.IO;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//
namespace BOX.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	public class RawMaterialsController : ControllerBase
	{
		private readonly IRepository _repository;

		public RawMaterialsController(IRepository repository)
		{
			_repository = repository;
		}

		[HttpGet]
		[Route("GetAllRawMaterials")]
		public async Task<IActionResult> GetAllRawMaterials()
		{
			try
			{
				var results = await _repository.GetAllRawMaterialsAsync();
				//use raw material vm to send QR code byte array as part of results otherwise QR code property
				//sets to null and we don't have it if the user wants to view or download it
				List<RawMaterialViewModel> rawMatVMList = new List<RawMaterialViewModel>();
				foreach (var rawMat in results)
				{
					var qrCode = await _repository.GetQRCodeAsync(rawMat.QRCodeID); //get QR code byte array; GetAllRawMaterialsAsync returns null for QR code

                    RawMaterialViewModel rawMatVM = new RawMaterialViewModel()
					{
						RawMaterialID = rawMat.RawMaterialID,
						Description = rawMat.Description,
						QRCodeID = rawMat.QRCodeID,
                        QRCodeBytes = qrCode.QR_Code_Photo
					};
					rawMatVMList.Add(rawMatVM);
				}

				return Ok(rawMatVMList);

				//return Ok(results);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		[HttpGet]
		[Route("GetRawMaterial/{rawmaterialId}")]
		public async Task<IActionResult> GetRawMaterialAsync(int rawmaterialId)
		{
			try
			{
				var result = await _repository.GetRawMaterialAsync(rawmaterialId);

				if (result == null) return NotFound("Raw material does not exist on system");
				else
				{
                    var qrCode = await _repository.GetQRCodeAsync(result.QRCodeID); //get QR code byte array; GetAllRawMaterialsAsync returns null for QR code

                    RawMaterialViewModel rawMatVM = new RawMaterialViewModel()
                    {
                        RawMaterialID = result.RawMaterialID,
                        Description = result.Description,
                        QRCodeID = result.QRCodeID,
                        QRCodeBytes = qrCode.QR_Code_Photo
                    };
					return Ok(rawMatVM);
                }

				//return Ok(result);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact B.O.X support");
			}
		}

		[HttpPost]
		[Route("AddRawMaterial")]
		//changed it from expecting viewmodel to string because the VM needed extra properties for the Get methods and that was causing issues
		public async Task<IActionResult> AddRawMaterial(string rawMaterialDescription)
		{
            try
            {
                var rawmaterial = new Raw_Material { Description = rawMaterialDescription };
                //QR Code logic
                var qrCodeBytes = GenerateQRCode(rawMaterialDescription); //generate QR code

                // Create a new QR_Code instance and assign the generated QR code bytes
                string b64string = qrCodeBytes.Remove(0, 22); //remove 'data:image/png;base64,' from string so I can call FromBase64String method

                var qrCode = new QR_Code
                {
                    //covert to byte array to prevent casting error
                    QR_Code_Photo = Convert.FromBase64String(b64string)
                };

                // Associate the QR code with the fixed product
                rawmaterial.QR_Code = qrCode;

				//save
                _repository.Add(rawmaterial);
				await _repository.SaveChangesAsync();

                return Ok(rawmaterial);
            }
			catch (Exception ex)
			{
				return BadRequest("Invalid transaction: " + ex.Message + "Extra info: " + ex.InnerException);
			}
		}

		[HttpPut]
		[Route("EditRawMaterial/{rawmaterialId}")]
        //changed it from expecting viewmodel to string because the VM needed extra properties for the Get methods and that was causing issues
        public async Task<ActionResult<RawMaterialViewModel>> EditRawMaterial(int rawmaterialId, string rawMaterialDescription)
		{
			try
			{
				var existingrawmaterial = await _repository.GetRawMaterialAsync(rawmaterialId);
				if (existingrawmaterial == null) return NotFound($"The Raw Material does not exist on the B.O.X System");

                //QR Code logic
                var qrCodeBytes = GenerateQRCode(rawMaterialDescription); //generate QR code
                //remove 'data:image/png;base64,' from string and convert to byte array to prevent casting error
                byte[] byteArr = Convert.FromBase64String(qrCodeBytes.Remove(0, 22));

                // Check if the existing raw material has a QR_Code instance
                if (existingrawmaterial.QR_Code == null)
                {
                    //If it doesn't, create a new QR_Code instance and assign the generated QR code bytes
                    existingrawmaterial.QR_Code = new QR_Code
                    {
                        QR_Code_Photo = byteArr
                    };

                }
                else
                {
                    existingrawmaterial.QR_Code.QR_Code_Photo = byteArr;
                }

                existingrawmaterial.Description = rawMaterialDescription;

				if (await _repository.SaveChangesAsync())
				{
					return Ok(existingrawmaterial);
				}
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
			}
			return BadRequest("Your request is invalid.");
		}

		[HttpDelete]
		[Route("DeleteRawMaterial/{rawmaterialId}")]
		public async Task<IActionResult> DeleteRawMaterial(int rawmaterialId)
		{
			try
			{
				var existingrawmaterial = await _repository.GetRawMaterialAsync(rawmaterialId);

				if (existingrawmaterial == null) return NotFound($"The Raw Material does not exist on the B.O.X System");

				_repository.Delete(existingrawmaterial);

				//delete associated QR code cos we aren't reusing it or retrieving historical data in any way
				var existingQRCode = await _repository.GetQRCodeAsync(existingrawmaterial.QRCodeID);
				_repository.Delete(existingQRCode);

				if (await _repository.SaveChangesAsync()) return Ok(existingrawmaterial);

			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
			}
			return BadRequest("Your request is invalid.");
		}

		//Generating the QR Code
		private string GenerateQRCode(string data)
		{
			QRCodeGenerator qrGenerator = new QRCodeGenerator();
			QRCodeData qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
			QRCode qrCode = new QRCode(qrCodeData);
			Bitmap qrCodeImage = qrCode.GetGraphic(20);

			using (MemoryStream stream = new MemoryStream())
			{
				qrCodeImage.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
				byte[] imageBytes = stream.ToArray();
				string base64Image = Convert.ToBase64String(imageBytes);
				return $"data:image/png;base64,{base64Image}";
			}
		}

	}
}


