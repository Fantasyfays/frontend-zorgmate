let API_BASE_URL = '';

if (process.env.REACT_APP_API_URL) {
    API_BASE_URL = process.env.REACT_APP_API_URL;
} else if (window.location.hostname === 'localhost') {
    API_BASE_URL = 'http://localhost:8080/api';
} else {
    API_BASE_URL = '/api';
}

export default API_BASE_URL;
