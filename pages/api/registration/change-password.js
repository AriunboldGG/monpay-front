import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const type = 'PHONE';
    const phone = req.body.phone;
    const token = req.body.token;
    const password = Buffer.from(req.body.password, 'utf-8').toString('base64');
    const reqBody = {
        accessType: type,
        accessValue: phone,
        passwordTokenValue: token,
        newPassword: password,
    };
    await axios.post(`/bayas/password`, reqBody).then(
        (resp) => {
            res.status(200).json(resp.data);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
