import axios from 'axios';
import API_BASE_URL from '../api';

const API_URL = `${API_BASE_URL}/invoices`;

const InvoiceService = {
    getAll: () => axios.get(API_URL),
    getById: (id) => axios.get(`${API_URL}/${id}`),
    update: (id, data) => axios.put(`${API_URL}/${id}`, data),
    updateStatus: (id, status) => axios.patch(`${API_URL}/${id}/status/${status}`),
    delete: (id) => axios.delete(`${API_URL}/${id}`),
    autoGenerate: (dto) => axios.post(`${API_URL}/auto-generate`, dto)
};

export default InvoiceService;
