import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';

export default async function handler(req, res) {
  const { query } = req;
  const permToken = req.cookies.auth;
  const headers = setHeaders(req);
  await axios.get(process.env.NEXT_PUBLIC_API_URL + 'wp/v2/banners').then(
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
