import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
import { hasPin } from './check-pin';

export async function getFullInfo(req) {
  const permToken = req.cookies.perm;
  const headers = setHeaders(req, true, true);

  return axios.get(`/info`, { headers: headers });
}

export default async function handler(req, res) {
  await getFullInfo(req).then(
    (resp) => {
      return hasPin(req).then(
        (pin) => {
          resp.data.result.pin = pin.data.result.pin;
          res.setHeader(
            'Cache-Control',
            // 'public, s-maxage=10, stale-while-revalidate=59',
            'private, max-age=10'
          );

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
