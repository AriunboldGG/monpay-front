import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';

export default async function handler(req, res) {
  const permToken = req.cookies.auth;
  const headers = setHeaders(req);
  const body = {
    billerUid: req.body?.billerUid,
    pin: req.body?.pin,
    amount: req.body?.amount,
    custNo: req.body?.custNo,
  };
  await axios
    .post(`/bill/products/${req.body.billProdId}/pay`, body, {
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
