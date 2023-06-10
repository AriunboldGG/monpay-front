import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const authToken = req.cookies.perm;
    const headers = setHeaders(req, true, true);

    const email = req.body.newEmail;
    const params = { accessType: 'EMAIL', accessValue: email, isNew: true };
    await axios
        .get(`/bayas/changeEmail/otp`, { params: params, headers: headers })
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
