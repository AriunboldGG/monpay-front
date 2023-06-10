import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export async function hasPin(req) {
    const authToken = req.cookies.auth;
    const headers = setHeaders(req);

    return axios.get(`/has/pin`, { headers: headers });
}

export default async function handler(req, res) {
    await hasPin(req).then(
        (resp) => {
            const status = resp.data.result;
            res.status(200).json(resp.data.result);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
