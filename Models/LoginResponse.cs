using System.Numerics;

namespace my_new_app.Models
{
    public class LoginResponse
    {
        public string JwtToken { get; set; }
        public DateTime Expiration { get; set; }
        public string RefreshToken { get; set; }
        public string Id { get; set; }
    }
}
