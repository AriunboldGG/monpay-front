import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
import { useSearchParams } from 'react-router-dom';

export default async function handler(req, res) {
    const { query } = req;
    const permToken = req.cookies.auth;
    const headers = setHeaders(req);

    await axios.get(`/sales`, { params: query, headers: headers }).then(
        (resp) => {
            res.status(200).json(resp.data);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
