import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const otp = req.body.otp;
    const phone = req.body.phone;
    const newpass = Buffer.from(req.body.newpassword, 'utf-8').toString(
        'base64'
    );
    const body = {
        otpValue: otp,
        accessType: 'PHONE',
        accessValue: phone,
        registerState: 'REGISTERED',
    };
    await axios.post(`/bayas/otp`, body).then(
        async (respToken) => {
            const passwordToken = respToken?.data?.result?.passwordToken?.value;
            const body = {
                accessType: 'PHONE',
                accessValue: phone,
                passwordTokenValue: passwordToken,
                newPassword: newpass,
            };
            const otpResult = await axios.post(`/bayas/password`, body).then(
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
