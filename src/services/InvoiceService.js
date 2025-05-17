import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/invoices`;

const InvoiceService = {
    getAll: () => axios.get(API_URL),
    getById: (id) => axios.get(`${API_URL}/${id}`),
    update: (id, data) => axios.put(`${API_URL}/${id}`, data),
    updateStatus: (id, status) => axios.patch(`${API_URL}/${id}/status/${status}`),
    delete: (id) => axios.delete(`${API_URL}/${id}`),
    autoGenerate: (dto) => axios.post(`${API_URL}/auto-generate`, dto)
};

export default InvoiceService;
