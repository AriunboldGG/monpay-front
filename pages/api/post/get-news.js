import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    await axios
        .get(
            `/news?pagingStart=-1&includeTotal=true&limit=99999` +
                (req?.query?.newsCatId
                    ? `&newsCatId=${req.query.newsCatId}`
                    : '')
        )
        .then(
            (resp) => {
                // const result = resp.data;
                res.status(200).json(resp.data);
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
