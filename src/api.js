let API_BASE_URL = '';

if (window.REACT_APP_API_URL) {
    API_BASE_URL = window.REACT_APP_API_URL;
} else if (window.location.hostname === 'localhost') {
    API_BASE_URL = 'http://localhost:8081/api';
} else {
    API_BASE_URL = '/api';
}

export default API_BASE_URL;
