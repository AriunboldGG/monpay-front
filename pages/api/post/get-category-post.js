import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    await axios
        .get(`/news/category` + (req?.query?.id ? `&id=${req.query.id}` : ''))
        .then(
            (resp) => {
                const result = resp.data.result;
                res.status(200).json(result);
            },
            (error) => {
                const resp = res
                    .status(error.response ? error.response.status : 500)
                    .json(
                        error.response
                            ? error.response.data
                            : { info: 'Алдаатай хүсэлт' }
                    );
            }
        );
}
