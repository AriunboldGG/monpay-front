import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    await axios.get(`/news/${req.query.id}?limit=50&pagingStart=-1`).then(
        (resp) => {
            const result = resp.data.result;
            res.status(200).json(result);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
