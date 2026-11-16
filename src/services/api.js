import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cybershield-backend-0hoo.onrender.com/api',
});

export default api;