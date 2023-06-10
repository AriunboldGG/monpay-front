import axios from '@/utils/axiosServer';
import { errorHandler } from '@/utils/error-handler';

export default async function handler(req, res) {
  const params = {
    limit: 50,
    pagingStart: -1,
    partnerId: req.body.Id,
  };
  await axios.get(`/partners`, { params: params }).then(
    (resp) => {
      const result = resp.data.result;
      res.status(200).json(result);
    },
    (error) => {
      errorHandler(res, error);
    }
  );
}
