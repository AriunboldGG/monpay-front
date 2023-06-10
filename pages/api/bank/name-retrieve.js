import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';

export default async function handler(req, res) {
  const headers = setHeaders(req);
  const params = {
    bankCode: req.body.bankCode,
    accountNo: req.body.accountNo,
  };
  await axios
    .get(`/cam/name-retrieve`, { params: params, headers: headers })
    .then(
      (resp) => {
        res.status(200).json(resp.data);
      },
      (error) => {
        errorHandler(res, error);
      }
    );
}
