import axios from 'axios';

const api = axios.create({
    baseURL: 'https://app-box-backend.herokuapp.com'
});

export default api;