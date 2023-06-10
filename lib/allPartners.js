import axios from 'axios';

export async function getAllPartnerId() {
    return await axios.get('/api/partner/all');
}

export async function getPartner(id) {
    return axios.get('/api/partner/single', {
        params: { partnerCategoryId: id },
    });
}
