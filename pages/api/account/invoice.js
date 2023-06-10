import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
  const authToken = req.cookies.auth;
  const body = req.body;
  const headers = setHeaders(req);

  await axios.post('/invoice', body, { headers: headers }).then(
    (resp) => {
      res.status(200).json(resp.data);
    },
    (error) => {
      errorHandler(res, error);
    }
  );
}
