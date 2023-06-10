import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { hasPin } from './check-pin';

export default async function handler(req, res) {
  const authToken = req.cookies.auth;
  const headers = setHeaders(req);

  await axios.get(`/data`, { headers: headers }).then(
    (resp) => {
      return hasPin(req).then(
        (pin) => {
          resp.data.result.pin = pin.data.result.pin;
          res.status(200).json(resp.data);
        },
        (error) => handleError(res, error)
      );
    },
    (error) => handleError(res, error)
  );
}

function handleError(res, error) {
  res
    .status(error.response ? error.response.status : 500)
    .json(error.response ? error.response.data : { info: 'Алдаатай хүсэлт' });
}
