import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const type = 'PHONE';
    const phoneNumber = req.body.phoneNumber;
    const registerNo = req.body.registerNo;
    const isNew = req.body.isNew;
    const params = {
        accessType: type,
        accessValue: phoneNumber,
        isNew: isNew,
        register: registerNo,
    };
    await axios
        .get(`/bayas/otp`, {
            params: params,
        })
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
}
