import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
export default async function handler(req, res) {
  const authToken = req.cookies.auth;
  const headers = setHeaders(req);

  const pin = req.body.pin;
  const amount = req.body.amount;

  const params = {
    pin: pin,
    amount: amount,
  };

  await axios.get(`/loan/repay`, { params: params, headers: headers }).then(
    (resp) => {
      res.status(200).json(resp.data);
    },
    (error) => {
      const info = error.response ? error.response.data : 'Алдаатай хүсэлт';
      const resp = res
        .status(error.response ? error.response.status : 500)
        .json({ info: info });
    }
  );
}
