import api from '../api';

const TimeEntryService = {
    create: (data) => api.post('/time-entries', data),
    getAll: () => api.get('/time-entries'),
    getUnbilledByClient: (id) => api.get(`/time-entries/unbilled/${id}`),
};

export default TimeEntryService;
