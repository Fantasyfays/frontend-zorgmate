import api from '../api';

export async function lookupAddress(postcode, houseNumber) {
    const response = await api.get('/address', {
        params: {
            postcode,
            huisnummer: houseNumber
        }
    });
    return response.data;
}
