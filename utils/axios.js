import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.MONPAY_API_URL}`,
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
