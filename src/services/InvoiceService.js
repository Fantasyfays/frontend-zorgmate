import api from '../api';

const InvoiceService = {
    getAll: () => api.get('/invoices'),
    getById: (id) => api.get(`/invoices/${id}`),
    update: (id, data) => api.put(`/invoices/${id}`, data),
    updateStatus: (id, status) => api.patch(`/invoices/${id}/status/${status}`),
    delete: (id) => api.delete(`/invoices/${id}`),
    autoGenerate: (dto) => api.post(`/invoices/auto-generate`, dto),
};

export default InvoiceService;
