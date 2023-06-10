import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const authToken = req.cookies.auth;
    const headers = setHeaders(req);

    const register = req.body.Register;
    const body = { register: register };
    await axios.get(`/pin/otp`, body, { headers: headers }).then(
        async (respotp) => {
            const otpResult = await axios
                .get(`/pin/otp`, body, { headers: header })
                .then();
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
