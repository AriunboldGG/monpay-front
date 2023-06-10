import axios from 'axios';

const MONPAY_URL = process.env.NEXT_PUBLIC_MONPAY_API_URL;

// export const login = async ({ username, password }) => {
//     return await axios
//         .post(
//             `${TOKEN_URL}/oauth/token?grant_type=password&username=` +
//                 username +
//                 '&password=' +
//                 password,
//             null,
//             {
//                 auth: {
//                     username: AUTH_USERNAME,
//                     password: AUTH_PASSWORD,
//                 },
//             }
//         )
//         .catch((error) => {

//             return error;
//         });
// };
