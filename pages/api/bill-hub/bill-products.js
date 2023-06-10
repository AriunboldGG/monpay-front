import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const permToken = req.cookies.auth;
    const headers = setHeaders(req);

    await axios.get(`/bill/products`, { headers: headers }).then(
        (resp) => {
            res.status(200).json(resp.data);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
