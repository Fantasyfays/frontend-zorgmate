import axios from 'axios';
import API_BASE_URL from './api'; // importeer van je config

const API = `${API_BASE_URL}/clients`;

const ClientService = {
    create: (data) => axios.post(API, data),
    getAll: () => axios.get(API)
};

export default ClientService;
