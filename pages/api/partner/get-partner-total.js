import axios from '@/utils/axiosServer';
import { errorHandler } from '@/utils/error-handler';

export default async function handler(req, res) {
  await axios.get(`/partners?limit=50&pagingStart=-1&includeTotal=true`).then(
    (resp) => {
      const result = resp.data;
      res.status(200).json(result);
    },
    (error) => {
      errorHandler(res, error);
    }
  );
}
