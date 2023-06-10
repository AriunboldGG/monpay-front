import axios from 'axios';

export async function ictApiGetBaseData({ lang }) {
    let menuMainName = 'main';

    try {
        const [menuMain, themeOption] = await Promise.all([
            axios
                .get(
                    process.env.NEXT_PUBLIC_API_URL +
                        'ict/v1/menu/' +
                        menuMainName,
                    { params: { lang: lang ? lang : '' } }
                )
                .then((response) => {
                    if (
                        response.status === 200 &&
                        response.data &&
                        response.data.result
                    ) {
                        return response.data.result;
                    }
                    return {};
                }),
            axios
                .get(process.env.NEXT_PUBLIC_API_URL + 'ict/v1/options/', {
                    params: { lang: lang ? lang : '' },
                })
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        return response.data;
                    }
                    return {};
                }),
        ]);
        return { menuMain, themeOption };
    } catch (err) {}
    return {};
}
export async function ictApiWPGetPost({ api, config, params, single }) {
    if (!config) {
        config = {};
    }

    if (params && typeof params === 'object') {
        config.params = params;
    }

    try {
        const response = await axios.get(
            process.env.NEXT_PUBLIC_API_URL + 'wp/v2/' + api,
            config
        );
        if (response && response.data) {
            if (single) {
                return response.data.length && response.data[0]
                    ? response.data[0]
                    : response.data.id
                    ? response.data
                    : {};
            }
            return response.data;
        }
    } catch (err) {}
    return {};
}
export async function ictApi({ api, config, params, single }) {
    if (!config) {
        config = {};
    }

    if (params && typeof params === 'object') {
        config.params = params;
    }

    try {
        const response = await axios.get(
            process.env.NEXT_PUBLIC_API_URL + api,
            config
        );
        if (response && response.data) {
            if (single) {
                return response.data.length && response.data[0]
                    ? response.data[0]
                    : response.data.id
                    ? response.data
                    : {};
            }
            return response.data;
        }
    } catch (err) {}
    return {};
}
