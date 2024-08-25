using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using my_new_app.Models;
using my_new_app.Services;
using my_new_app.Services.ItemService.FileService;
using System.IdentityModel.Tokens.Jwt;
using System.Numerics;
using System.Security.Claims;
using System.Security.Principal;

namespace my_new_app.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<User> _userManager;
        private readonly IFileService _fileService;
        public AuthController(IAuthService authService, UserManager<User> userManager, IFileService fileService)
        {
            _authService = authService;
            _userManager = userManager;
            _fileService = fileService;
        }
        

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterUser(RegisterUser user)
        {
            if (user.Password != user.ConfirmPassword) { return BadRequest("Passwords don't match"); }
            if (await _authService.RegisterUser(user))
            {
                var fireForgetLendeeId = BackgroundJob.Enqueue<IEmailService>(x => x.SendEmail(user.Email, "Welcome to CampusConnect!", $"Dear, {user.Firstname} welcome to CampusConnect. CampusConnect is a marketplace where you can sell your second hand items, donate items, lend items and keep track of your lost and found items. You can reply to this e-mail for our support line.\nEnjoy!!!"));
                return Ok("Successfully registered");
            }

            return BadRequest("Went wrong");
        }
        

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginUser user)
        {
            if (!ModelState.IsValid) 
            {
                return BadRequest();
            }
            if(await _authService.Login(user))
            {
                var tokenString = _authService.GenerateTokenString(user);
                await _authService.UpdateRefresh(user, tokenString.RefreshToken);   
                var principal = _authService.GetPrincipal(tokenString.JwtToken);
                //tokenString.Id = _authService.GetUserId(principal);
                var loggeruser = await _userManager.FindByNameAsync(principal.Identity.Name);
                tokenString.Id = loggeruser.Id;

                //Below is the code to add claims.
                await _userManager.AddClaimAsync(loggeruser, new Claim("chatId", tokenString
                    .Id));

                return Ok(tokenString);
            }
            return BadRequest();

            
        }

        [HttpPost("Refresh")]
        public async Task<IActionResult> Refresh(RefreshModel model)
        {
            var tokenPrincipal = _authService.GetPrincipal(model.AccessToken);
            

            
            if (tokenPrincipal?.Identity?.Name is null) { return Unauthorized("failed at first"); }


            var user = await _userManager.FindByNameAsync(tokenPrincipal.Identity.Name);


            if (user is null || user.RefreshToken != model.RefreshToken || user.RefreshTokenExpiry < DateTime.UtcNow)
                return Unauthorized("failed at second");

            LoginUser logUser = new LoginUser();
            logUser.Email = user.Email;
            

            var token = _authService.GenerateTokenString(logUser);

            return Ok(new LoginResponse
            {
                JwtToken = token.JwtToken,
                Expiration = token.Expiration,
                RefreshToken = user.RefreshToken
            });

        }

        [Authorize]
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordUser user) //change this so it takes an email and new password, finds user in DB, and changes its password, MAYBE MAKE IT [AUTHORIZE]
        {
            if (user.NewPassword != user.ConfirmPassword) { return BadRequest("New passwords don't match"); }

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _authService.ChangePassword(user);
            if (result.Succeeded)
            {
                return Ok("Successfully done");
            }

            return BadRequest("Went wrong");

        }

        [Authorize]
        [HttpPost("DeleteUser")]
        public async Task<IActionResult> DeleteUser(DeleteUser user) //change this so it takes an email, finds user in DB, and deletes it, MAYBE MAKE IT [AUTHORIZE]
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _authService.DeleteUser(user);
            if (result.Succeeded)
            {
                return Ok("Successfully deleted user.");
            }
            
            return BadRequest("Went wrong");

        }
        [Authorize]
        [HttpPost("DeleteUserByPrincipal")]
        public async Task<IActionResult> DeleteUserByPrincipal(string token) 
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _authService.DeleteUserByPrincipal(token);
            if (result.Succeeded)
            {
                return Ok("Successfully deleted user with principal.");
            }

            return BadRequest("Went wrong");

        }
        [HttpPost("ChangeUserDescription")]
        public async Task<IActionResult> ChangeUserDescription(string newDescription, string token)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _authService.ChangeDescriptionByPrincipal(newDescription, token);

            if (result.Succeeded)
            {
                return Ok("Successfully changed user description with principal.");
            }

            return BadRequest("Went wrong");
        }
     
        [Authorize]
        [HttpGet("Get")]
        public string Get()
        {
            return "You hit me!";
        }

        [HttpGet("GetById")]
        public async Task<User> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return user;
        }

        [HttpPost("AddProfilePicture")]
        public async Task<IActionResult> AddProfilePicture(string newDescription, string token)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _authService.ChangeDescriptionByPrincipal(newDescription, token);

            if (result.Succeeded)
            {
                return Ok("Successfully changed user description with principal.");
            }

            return BadRequest("Went wrong");
        }

        [HttpGet("ChangeProfilePicture")]
        public async Task<IActionResult> SavePic(string userId ,IFormFile imageFile)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var fileResult = await _fileService.SaveImage(imageFile, PhotoType.profilePhoto);
            if(user.ImageName != null)
            {
                await _fileService.DeleteImage(user.ImageName, PhotoType.profilePhoto);
            }
            user.ImageName = fileResult.Item2;  // getting name of image
            return Ok("Successfully changed profile picture.");
        }

        [HttpGet("GetProfilePicture")]
        public async Task<IActionResult> GetProfilePic(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var imageName = user.ImageName;
            if(imageName == null)
            {
                return BadRequest("This user has no profile picture");
            }
            return Ok(_fileService.GetImage(imageName, PhotoType.profilePhoto));
        }
    }
}
