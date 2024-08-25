using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using my_new_app.Models;
using System.Security.Claims;
using System.Threading.Tasks;

namespace my_new_app.Services
{
    public interface IAuthService
    {
        LoginResponse GenerateTokenString(LoginUser user);
        //Task<IActionResult> Refresh(RefreshModel model);
        ClaimsPrincipal? GetPrincipal(string token);
        Task<bool> Login(LoginUser user);
        Task<bool> RegisterUser(RegisterUser user);
        Task<IdentityResult> ChangePassword(ChangePasswordUser user);
        
        Task<IdentityResult> DeleteUser(DeleteUser user);
        string GenerateRefreshToken();
        Task<IdentityResult> UpdateRefresh(LoginUser user, string refreshToken);
        Task<IdentityResult> DeleteUserByPrincipal(string token);
        Task<IdentityResult> ChangeDescriptionByPrincipal(string newDesc, string token);
        Task<bool> GetUserEmailById(string id);

    }
}