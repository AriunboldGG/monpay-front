import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const authToken = req.cookies.auth;
    const headers = setHeaders(req);

    await axios.get(`/loan/max/product`, { headers: headers }).then(
        (resp) => {
            res.status(200).json(resp.data.result);
        },
        (error) => {
            const info = error.response
                ? error.response.data
                : 'Алдаатай хүсэлт';
            const resp = res
                .status(error.response ? error.response.status : 500)
                .json({ info: info });
        }
    );
}
