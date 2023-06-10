import axios from '../../../../utils/axios';
import { setHeaders } from '@/utils/headerConfig';

export default async function handler(req, res) {
  const permToken = req.cookies.auth;
  const headers = setHeaders(req);

  await axios.get(`/get/etokencard`, { headers: headers }).then(
    (resp) => {
      res.status(200).json(resp.data);
    },
    (error) => {
      errorHandler(res, error);
    }
  );
}
