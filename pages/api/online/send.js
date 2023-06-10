import axios from '../../../utils/axios';
import formidable from 'formidable';
import FormData from 'form-data';
import { createReadStream } from 'fs';
export const config = {
    api: {
        bodyParser: false,
    },
};
export default async function handler(req, res) {
    const form = new formidable.IncomingForm();
    form.uploadDir = './';
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        const formData = new FormData();
        if (fields.front !== '') {
            formData.append('front', createReadStream(files.front.filepath));
        }
        if (fields.back !== '') {
            formData.append('back', createReadStream(files.back.filepath));
        }
        if (fields.signature) {
            formData.append('signature', signature);
        }
        const authToken = req.cookies.perm;
        const headers = setHeaders(req, true, true);

        axios
            .put(`here/your/api`, formData, {
                headers: formData.getHeaders(headers),
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
        if (err) {
        }
    });
}
