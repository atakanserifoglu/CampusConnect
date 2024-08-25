// axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bilcampusconnect.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('yourAuthTokenKey')}`,
  },
});

api.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
    console.log('error response::: ', error.response.status);
      // Check if the error is 401 and not already retried
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          const refreshResponse = await axios.post('https://bilcampusconnect.azurewebsites.net/api/Auth/Refresh', {
            accessToken: localStorage.getItem('yourAuthTokenKey'),
            refreshToken: localStorage.getItem('yourRefreshTokenKey'),
          });
  
          const refreshedToken = refreshResponse.data.jwtToken;
          localStorage.setItem('yourAuthTokenKey', refreshedToken);
  
          originalRequest.headers['Authorization'] = `Bearer ${refreshedToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing token', refreshError);
          // Properly handle failed refresh here (e.g., redirect to login)
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );
  
// api.interceptors.response.use(
//   response => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//         console.log('Attempting to refresh token');
//       originalRequest._retry = true;

//       try {
//         const refreshResponse = await axios.post('https://bilcampusconnect.azurewebsites.net/api/Auth/Refresh', {
//           accessToken: localStorage.getItem('yourAuthTokenKey'),
//           refreshToken: localStorage.getItem('yourRefreshTokenKey'),
//         });

//         const refreshedToken = refreshResponse.data.jwtToken;
//         localStorage.setItem('yourAuthTokenKey', refreshedToken);

//         originalRequest.headers['Authorization'] = `Bearer ${refreshedToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error('Error refreshing token', refreshError);
//         // logoutFunction();
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
