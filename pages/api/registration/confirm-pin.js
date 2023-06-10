import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const type = 'PHONE';
    const phoneNumber = req.body.phoneNumber;
    const pin = req.body.pin;
    const state = req.body.isNew ? 'NEW' : 'REGISTERED';
    let reqBody = {
        accessType: type,
        accessValue: phoneNumber,
        otpValue: pin,
        registerState: state,
    };
    await axios.post(`/bayas/otp`, reqBody).then(
        (resp) => {
            const result = resp.data.result;
            const token = result.passwordToken.value;
            const body = { token: token };
            res.status(200).json(body);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
