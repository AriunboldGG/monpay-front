import axios from 'axios';

export const getFullInfo = () => {
    return axios.get('/api/user/info').then(
        (resp) => resp.data.result,
        (error) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('user');
                // router.push('/login');
                return Promise.reject(error.response);
                // router.push('/login');
            } else {
                return Promise.reject(error.response);
            }
        }
    );
};
