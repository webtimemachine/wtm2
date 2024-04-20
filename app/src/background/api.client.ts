import axios, {
  AxiosInstance,
  //  AxiosResponse
} from 'axios';

// interface RefreshResponse {
//   accessToken: string;
//   refreshToken: string;
// }

export const apiClient: AxiosInstance = axios.create({
  // baseURL: 'https://your-api-base-url.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// apiClient.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem('accessToken');
//     if (accessToken) {
//       config.headers!['Authorization'] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 403 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       const refreshToken = localStorage.getItem('refreshToken');

//       if (refreshToken) {
//         try {
//           const refreshResponse = await apiClient.get<RefreshResponse>(
//             '/api/auth/refresh',
//             {
//               headers: {
//                 Authorization: `Bearer ${refreshToken}`,
//               },
//             },
//           );

//           const newAccessToken = refreshResponse.data.accessToken;
//           localStorage.setItem('accessToken', newAccessToken);

//           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//           return apiClient(originalRequest);
//         } catch (refreshError) {
//           localStorage.removeItem('accessToken');
//           window.location.href = '/login';
//           return Promise.reject(refreshError);
//         }
//       } else {
//         localStorage.removeItem('accessToken');
//         window.location.href = '/login';
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   },
// );
