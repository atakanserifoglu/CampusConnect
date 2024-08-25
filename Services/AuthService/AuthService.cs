using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using my_new_app.Models;
using NuGet.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Cryptography.Pkcs;
using System.Text;

namespace my_new_app.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;

        public AuthService(UserManager<User> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

       

        public async Task<bool> RegisterUser(RegisterUser user)
        {
            var identityUser = new User
            {
                UserName = user.Email,
                Name = user.Firstname + " " + user.Lastname,
                Email = user.Email,
                RefreshToken = "koko",
                Description = "Provide a short description of yourself"




            };
            
            

            var result = await _userManager.CreateAsync(identityUser, user.Password);
            
            return result.Succeeded;



        }

        public async Task<bool> Login(LoginUser user)
        {
            var identityUser = await _userManager.FindByEmailAsync(user.Email);
            if(identityUser == null) { return false; }

            return await _userManager.CheckPasswordAsync(identityUser, user.Password);
            
            

        }

        public async Task<IdentityResult> ChangePassword(ChangePasswordUser user)
        {

            var tokenPrincipal = GetPrincipal(user.Token);
            var changeUser = await _userManager.FindByNameAsync(tokenPrincipal.Identity.Name);
            

            if(await _userManager.CheckPasswordAsync(changeUser, user.CurrentPassword))
            {
                return await _userManager.ChangePasswordAsync(changeUser, user.CurrentPassword, user.NewPassword);
            }

            return IdentityResult.Failed();
             
            
        }

        

        public async Task<IdentityResult> DeleteUser(DeleteUser user)
        {
            var deleteUser = await _userManager.FindByEmailAsync(user.Email);
            if(await _userManager.CheckPasswordAsync(deleteUser, user.Password)) { return await _userManager.DeleteAsync(deleteUser); }
                
            
            return IdentityResult.Failed();
        }

        public async Task<IdentityResult> DeleteUserByPrincipal(string token)
        {
            var tokenPrincipal = GetPrincipal(token);

            var user = await _userManager.FindByNameAsync(tokenPrincipal.Identity.Name);

            return await _userManager.DeleteAsync(user);
        }

        public async Task<IdentityResult> ChangeDescriptionByPrincipal(string newDesc, string token)
        {
            var tokenPrincipal = GetPrincipal(token);

            var user = await _userManager.FindByNameAsync(tokenPrincipal.Identity.Name);

            user.Description = newDesc;

            return await _userManager.UpdateAsync(user);
        }

        public LoginResponse GenerateTokenString(LoginUser user)
        {
            
            var claims = new List<Claim>
            {  
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, "Admin"),
            };

            SecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("Jwt:Key").Value));

            SigningCredentials signingCred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
            var securityToken = new JwtSecurityToken(
                claims:claims,
                expires: DateTime.Now.AddMinutes(30),
                issuer:_config.GetSection("Jwt:Issuer").Value,
                audience: _config.GetSection("Jwt:Audience").Value,
                signingCredentials: signingCred);
            string tokenString = new JwtSecurityTokenHandler().WriteToken(securityToken);

            var response = new LoginResponse();

            response.JwtToken = tokenString;
            response.Expiration = securityToken.ValidTo;

            var refreshToken = GenerateRefreshToken();

            response.RefreshToken = refreshToken;

            /*var identityUser = await _userManager.FindByEmailAsync(user.Email);

            identityUser.RefreshToken = refreshToken;
            identityUser.RefreshTokenExpiry = DateTime.UtcNow.AddDays(3);
            await _userManager.UpdateAsync(identityUser);*/

            return response;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];

            using var generator = RandomNumberGenerator.Create();

            generator.GetBytes(randomNumber);

            return Convert.ToBase64String(randomNumber);
        }


        public async Task<IdentityResult> UpdateRefresh(LoginUser user, string refreshToken)
        {
            var updateUser = await _userManager.FindByEmailAsync(user.Email);

            updateUser.RefreshToken = refreshToken;
            updateUser.RefreshTokenExpiry = DateTime.UtcNow.AddDays(3);
            return await _userManager.UpdateAsync(updateUser);
        }

        /*public async Task<IActionResult> Refresh(RefreshModel model)
        {
            var tokenPrincipal = GetPrincipal(model.AccessToken);
            if (tokenPrincipal?.Identity?.Name is null)
            {

                
            }

            var user = await _userManager.FindByNameAsync(tokenPrincipal.Identity.Name);

            if (user is null || user.RefreshToken != model.RefreshToken || user.RefreshTokenExpiry < DateTime.UtcNow)
            {

            }
                

        }*/

        public ClaimsPrincipal? GetPrincipal(string? token)
        {
            var secret = _config["JWT:Secret"] ?? throw new InvalidOperationException("Secret not configured");

            var validation = new TokenValidationParameters()
            {
                ValidateActor = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                RequireExpirationTime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _config["Jwt:Issuer"],
                ValidAudience = _config["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("Jwt:Key").Value)),
                ValidateLifetime = false
            };

            return new JwtSecurityTokenHandler().ValidateToken(token, validation, out _);
        }

        public async Task<bool> GetUserEmailById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return user.Email == "pepo@gmail.com";


        }

    }
}
