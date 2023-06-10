import axios from 'utils/axios';
import formidable from 'formidable';
import { setHeaders } from '@/utils/headerConfig';

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
        if (fields.firstname !== '') {
            formData.append('firstName', fields.firstname);
        }

        if (fields.lastname !== '') {
            formData.append('lastName', fields.lastname);
        }
        if (fields.image !== '') {
            const image = files.image;
            formData.append('image', createReadStream(image.filepath));
        }
        const headers = setHeaders(req, true, true);

        axios
            .put(`/profile`, formData, {
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
