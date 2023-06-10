import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const permToken = req.cookies.auth;
    const passwordToken = req.cookies.pass;
    const headers = setHeaders(req);

    const pin = req.body.pin;
    const body = {
        passwordToken: passwordToken,
        newPin: pin,
    };
    await axios.post(`/pin/set`, body, { headers: headers }).then(
        (resp) => {
            res.status(200).json(resp.data);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
