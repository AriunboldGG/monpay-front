import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
export default async function handler(req, res) {
    const permToken = req.cookies.perm;
    const headers = setHeaders(req, true, true);
    const body = {
        firstPin: req.body.firstPin,
        oldPin: req.body.oldpin,
        newPin: req.body.newpin,
    };
    await axios.put(`/pin/change`, body, { headers: headers }).then(
        (resp) => {
            res.status(200).json(resp.data);
        },
        (error) => {
            errorHandler(res, error);
        }
    );
}
