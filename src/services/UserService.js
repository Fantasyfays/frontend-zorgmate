import axios from 'axios';
import API_BASE_URL from './api';

const API_URL = `${API_BASE_URL}/users`;

const getAll = () => axios.get(API_URL);
const getById = (id) => axios.get(`${API_URL}/${id}`);
const register = (user) => axios.post(`${API_URL}/register`, user);
const update = (id, user) => {
    const payload = {
        username: user.username,
        role: user.role
    };
    return axios.put(`${API_URL}/${id}`, payload);
};
const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);

const UserService = {
    getAll,
    getById,
    register,
    update,
    delete: deleteUser
};

export default UserService;
