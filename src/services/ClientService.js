import api from '../api';

const ClientService = {
    create: (data) => api.post('/clients', data),
    getAll: () => api.get('/clients'),
};

export default ClientService;
