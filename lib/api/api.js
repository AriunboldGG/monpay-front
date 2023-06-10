import axios from 'axios';
import { axiosWithInterceptor } from './axiosCustom';

const callGet = async (url) => {
    return await axiosWithInterceptor(false).get(url);
};

const callPostAuth = async (command, body, { port }) => {
    return await newAxiosWithPort({ port: port }).post(`${command}`, body);
};

const callPost = async (url, body, { port }) => {
    // if (port === 'web') {
    return await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/${port}${url}`,
        body
    );
    // }
};

const apiList = {
    // 'web' resources
    banks: '/banks',
    registerVerify: '/api/user/register/verify',
};

export { callGet, callPost, callPostAuth, apiList };
