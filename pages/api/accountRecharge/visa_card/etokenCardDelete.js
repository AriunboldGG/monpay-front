import axios from 'axios';
import { setHeaders } from '@/utils/headerConfig';

export default async function handler(req, res) {
    const { query } = req;
    const permToken = req.cookies.auth;
    const headers = setHeaders(req);

    await axios
        .delete(
            `${process.env.MONPAY_API_URL}/delete/etokencard/${query.cardId}`,
            {
                headers: headers,
            }
        )
        .then(
            (resp) => {
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
