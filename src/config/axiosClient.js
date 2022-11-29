import axios from 'axios';
import session from '../utils/sessionStorage';

const axiosClient = axios.create({
  // baseURL: process.env.API_URL,
  headers: {
    common: {
      Authorization: `${session.token()}`,
    },
  },
});

axiosClient.interceptors.response.use((response) => {
  if (response.data.token) {
    session.setData(response.data);
    axiosClient.defaults.headers.common.Authorization = `${response.data.token}`;
  }

  return response;
}, (error) => {
  console.log(error);
  if (!error.response) {
    return Promise.reject(error.message);
  }

  switch (error.response.status) {
    case 400:
      /*
        implement here any action in your app, like redirect to anoher content
      */

      return Promise.reject(error.response.data);
    case 501:
      session.logout();
      axiosClient.defaults.headers.common.Authorization = '';
      window.history.pushState({ prevUrl: window.location.href.pathname }, null, '/login');
      window.location.href = '/login';
      return error.response;
    default:
      return Promise.reject(error.response.data);
  }
});

export default axiosClient;
