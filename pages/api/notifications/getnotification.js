import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const authToken = req.cookies.auth;
    const headers = setHeaders(req);
    const params = {
        limit: req.body.limit,
    };
    await axios.get(`/notification`, { params: params, headers: headers }).then(
        (resp) => {
            res.setHeader(
                'Cache-Control',
                // 'public, s-maxage=10, stale-while-revalidate=59',
                'public, max-age=300'
            );
            res.status(200).json(resp.data);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
