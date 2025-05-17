import axios from 'axios';

const API = `${process.env.REACT_APP_API_URL}/clients`;

const ClientService = {
    create: (data) => axios.post(API, data),
    getAll: () => axios.get(API)
};

export default ClientService;
