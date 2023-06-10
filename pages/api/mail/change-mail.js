import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
  const permToken = req.cookies.perm;
  const headers = setHeaders(req, true, true);

  const otp = req.body.otp;
  const newemail = req.body.newEmail;
  const params = {
    otpValue: otp,
    accessType: 'EMAIL',
    accessValue: newemail,
    registerState: 'NEW',
  };
  await axios.post(`bayas/otp`, params).then(
    async (resp) => {
      const passwordToken = resp?.data?.result?.passwordToken?.value;
      const params = {
        passwordToken: passwordToken,
        newEmail: newemail,
      };
      const otpResult = await axios
        .get(`/bayas/changeEmail`, { params: params, headers: headers })
        .then(
          (resp) => {
            res.status(200).json(resp.data);
          },
          (error) => {
            const resp = res
              .status(error.response ? error.response.status : 500)
              .json(
                error.response
                  ? error.response.data
                  : { info: 'Алдаатай хүсэлт' }
              );
          }
        );
    },
    (error) => {
      errorHandler(res, error);
    }
  );
}
