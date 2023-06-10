import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';

export default async function handler(req, res) {
  const permToken = req.cookies.auth;
  const headers = setHeaders(req);
  const body = {
    user_id: req.body.user_id,
    card_id: req.body.card_id,
    amount: req.body.amount,
    pin: req.body.pin,
    account: req.body.account,
    profile_type: '1',
  };

  await axios
    .post(`/charge/etokencard`, body, {
      headers: headers,
    })
    .then(
      (resp) => {
        res.status(200).json(resp.data);
      },
      (error) => {
        const resp = res
          .status(error.response ? error.response.status : 500)
          .json(
            error.response ? error.response.data : { info: 'Алдаатай хүсэлт' }
          );
      }
    );
}
