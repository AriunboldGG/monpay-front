import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const authToken = req.cookies.auth;
    const params = req.body;
    const headers = setHeaders(req);

    await axios.get(`/cam/lookup`, { headers: headers, params: params }).then(
        (resp) => {
            res.status(200).json(resp.data.result);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
