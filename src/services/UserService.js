import api from '../api';

const getAll = () => api.get('/users');
const getById = (id) => api.get(`/users/${id}`);
const register = (user) => api.post(`/users/register`, user);
const update = (id, user) => api.put(`/users/${id}`, {
    username: user.username,
    role: user.role
});
const deleteUser = (id) => api.delete(`/users/${id}`);

const UserService = { getAll, getById, register, update, delete: deleteUser };
export default UserService;
