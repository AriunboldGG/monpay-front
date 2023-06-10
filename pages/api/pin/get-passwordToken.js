import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const otp = req.body.otp;
    const phone = req.body.phone;
    const body = {
        otpValue: otp,
        accessType: 'PHONE',
        accessValue: phone,
        registerState: 'REGISTERED',
    };
    await axios.post(`/bayas/otp`, body).then(
        (resp) => {
            res.status(200).json(resp.data);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
