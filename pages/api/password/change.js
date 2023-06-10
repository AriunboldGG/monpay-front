import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const authToken = req.cookies.auth;
    const headers = setHeaders(req);

    const phone = req.body.Phone;
    const password = Buffer.from(req.body.Password, 'utf-8').toString('base64');
    const register = req.body.Register;
    const params = {
        accessType: 'PHONE',
        accessValue: phone,
        isNew: false,
    };
    await axios
        .get(`/bayas/changePassword/otp`, { params: params, headers: headers })
        .then(
            async (respOtp) => {
                resOtp.status(200).json(respOtp.data);
                const Otp = resOtp?.data?.result?.passwordToken?.value;
                const otpResult = await axios
                    .get(`/pin/otp`, body, { headers: headers })
                    .then();
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
}
