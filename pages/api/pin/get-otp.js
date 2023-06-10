import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const authToken = req.cookies.auth;
    const headers = setHeaders(req);

    const register = req.body.Register;
    const params = {
        register: register,
    };
    await axios.get(`/pin/otp`, { params: params, headers: headers }).then(
        (resp) => {
            res.status(200).json(resp.data);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
