import axios from '@/utils/axiosServer';
import { errorHandler } from '@/utils/error-handler';

export default async function handler(req, res) {
  const params = {
    limit: req.body.limit,
    partnerCategoryId: req.body.partnerCategoryId,
  };
  await axios.get(`/partners?limit=3&pagingStart=-1`, { params: params }).then(
    (resp) => {
      const result = resp.data.result;
      res.status(200).json(result);
    },
    (error) => {
      errorHandler(res, error);
    }
  );
}
