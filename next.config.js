const nextTranslate = require('next-translate');
module.exports = nextTranslate({
    i18n: {
        locales: ['mn', 'en'],
        defaultLocale: 'mn',
        localeDetection: false,
    },
    keySeperator: '.',
});
