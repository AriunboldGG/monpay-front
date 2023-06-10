import axios from '@/utils/axiosServer';
import { errorHandler } from '@/utils/error-handler';

export default async function handler(req, res) {
  await axios.get(`/partner_categories`).then(
    (resp) => {
      const result = resp.data.result;
      res.status(200).json(result);
    },
    (error) => {
      errorHandler(res, error);
    }
  );
}
