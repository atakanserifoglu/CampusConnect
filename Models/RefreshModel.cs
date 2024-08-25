using Microsoft.Identity.Client;

namespace my_new_app.Models
{
    public class RefreshModel
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        
    }
}
