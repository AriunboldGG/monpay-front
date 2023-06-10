import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
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
        if (fields.firstname !== '') {
            formData.append('firstName', fields.firstname);
        }

        if (fields.lastname !== '') {
            formData.append('lastName', fields.lastname);
        }
        if (fields.registerNo !== '') {
            formData.append('registerNo', fields.registerNo);
        }
        if (fields.image !== '') {
            const image = files.image;
            formData.append('image', createReadStream(image.filepath));
        }
        const headers = setHeaders(req, true, true);

        axios
            .post(`/register`, formData, {
                headers: formData.getHeaders(headers),
            })
            .then(
                (resp) => {
                    return res.status(200).json({
                        resp: resp.data,
                    });
                },
                (error) => {
                    errorHandler(res, error);
                }
            );
    });
}
