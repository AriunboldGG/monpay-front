import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';

export default async function handler(req, res) {
  const permToken = req.cookies.auth;
  const params = {
    billerUid: req.body.billerUid,
  };
  const headers = setHeaders(req);

  await axios
    .delete(`/bill/products/${req.body.billProdId}/disconnect`, {
      params: params,
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
