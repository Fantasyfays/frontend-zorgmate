import axios from 'axios';

const API = `${process.env.REACT_APP_API_URL}/time-entries`;

const TimeEntryService = {
    create: (data) => axios.post(API, data),
    getAll: () => axios.get(API),
    getUnbilledByClient: (id) => axios.get(`${API}/unbilled/${id}`)
};

export default TimeEntryService;
