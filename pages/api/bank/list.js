import axios from '@/utils/axiosServer';
import { errorHandler } from '@/utils/error-handler';

export default async function handler(req, res) {
  await axios.get(`/achcandytobank/banklist`).then(
    (resp) => {
      res.status(200).json(resp.data.result.banks);
    },
    (error) => {
      errorHandler(res, error);
    }
  );
}
