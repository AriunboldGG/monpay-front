import axios from '@/utils/axiosServer';
import { setHeaders } from '@/utils/headerConfig';
import { errorHandler } from '@/utils/error-handler';
import formidable from 'formidable';
import FormData from 'form-data';

export default async function handler(req, res) {
  const type = 'PHONE';
  const phoneNumber = req.body.phone;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const image = req.body.image;
  const registerNo = req.body.registerNo;
  const state = req.body.registerState;

  const password = Buffer.from(req.body.password, 'utf-8').toString('base64');
  const reqBody = {
    accessType: type,
    accessValue: phoneNumber,
    password: password,
  };
  const headers = setHeaders(req, false);
  await axios.post(`/bayas/dologin`, reqBody, { headers }).then(
    async (resp) => {
      const result = resp.data.result;
      const accToken = result.accessToken.value;

      const permToken = await getPermToken(
        type,
        phoneNumber,
        accToken,
        headers
      );

      if (!permToken || permToken.error)
        return res.status(401).json({ info: permToken.error.info });

      const userRegister = await getRegister(permToken, req, res, headers);

      if (userRegister) {
        return res.status(408).json({
          info: userRegister.error.info,
        });
      } else {
        const authToken = await getAuthToken(permToken, headers);
        if (!authToken || authToken.error) {
          return res.status(401).json({
            info: authToken.error.info,
          });
        }
        return res
          .status(200)
          .json({ authToken: authToken, permToken: permToken });
      }
    },
    (error) => {
      errorHandler(res, error);
    }
  );
}

const getPermToken = async (type, phoneNumber, accToken, headers = {}) => {
  const params = {
    loginAccessType: type,
    loginAccessValue: phoneNumber,
    accessTokenValue: accToken,
  };

  return axios
    .get(`/bayas/permtoken`, {
      params: params,
      headers,
    })
    .then(
      (resp) => {
        const result = resp.data.result;
        const permToken = result.permanentToken.value;
        return permToken;
      },
      (error) => {
        return { error: error.response.data };
      }
    );
};
const getRegister = async (permToken, req, res, headers = {}) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = './';
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    const formData = new FormData();
    formData.append('firstName', fields.firstname);
    formData.append('lastName', fields.lastname);
    formData.append('registerNo', fields.registerNo);
    const header = {
      Authorization: `Bearer ${permToken}`,
      'Accept-Language': headers['Accept-Language'] ?? 'mn',
    };
    return axios.post(`/register`, formData, { headers: header }).then(
      (resp) => {
        const result = resp.data.result;
        return result;
      },
      (error) => {
        return { error: error.response.data };
      }
    );
  });
};

const getAuthToken = async (permToken, headers = {}) => {
  const header = {
    Authorization: `Bearer ${permToken}`,
    'Accept-Language': headers['Accept-Language'] ?? 'mn',
  };
  return axios
    .get(`/auth/new`, {
      headers: header,
    })
    .then(
      (resp) => {
        const result = resp.data.result;
        return result.token;
      },
      (error) => {
        return { error: error.response.data };
      }
    );
};
