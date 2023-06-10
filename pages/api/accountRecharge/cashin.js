import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
  const amount = req.body.amount;
  const headers = setHeaders(req);

  const reqBody = {
    amount: amount,
  };
  await axios
    .post(`/qpay/cashin`, reqBody, {
      headers: headers,
    })
    .then(
      (resp) => {
        res.status(200).json(resp.data);
      },
      (error) => {
        errorHandler(res, error);
      }
    );
}
