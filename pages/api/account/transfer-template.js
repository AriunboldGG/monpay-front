import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';

export default async function handler(req, res) {
  const authToken = req.cookies.auth;
  const body = req.body;
  const headers = setHeaders(req);

  const method = req.method;
  if (method === 'GET') {
    await axios.get('/achcandytobank/templatelist', { headers: headers }).then(
      (resp) => {
        res.status(200).json(resp.data.result);
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

  if (method === 'POST') {
    await axios
      .post('/achcandytobank/template', body, { headers: headers })
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
}
