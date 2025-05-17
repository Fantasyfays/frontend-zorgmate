import axios from 'axios';
import API_BASE_URL from '../api';

const API = `${API_BASE_URL}/time-entries`;

const TimeEntryService = {
    create: (data) => axios.post(API, data),
    getAll: () => axios.get(API),
    getUnbilledByClient: (id) => axios.get(`${API}/unbilled/${id}`)
};

export default TimeEntryService;
