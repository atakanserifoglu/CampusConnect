import axios from "axios";


const refreshAuthToken = async () => {
    console.log('Attempting to refresh token');
  try {
    const refreshResponse = await axios.post(
      "https://bilcampusconnect.azurewebsites.net/api/Auth/Refresh",
      {
        accessToken: localStorage.getItem("yourAuthTokenKey"),
        refreshToken: localStorage.getItem("yourRefreshTokenKey"),
      }
    );

    localStorage.setItem("yourAuthTokenKey", refreshResponse.data.jwtToken);
    return true;
  } catch (error) {
    console.error("Error refreshing token", error);

    return false;
  }
};

// const logoutFunction = () => {
//      console.log("Logout");
//      auth.logout(); // Redirect to the dashboard
//      navigate("/");
//   };


  export { refreshAuthToken };
//   export { logoutFunction };
