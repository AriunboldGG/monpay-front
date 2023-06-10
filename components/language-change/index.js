import React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import jsCookie from 'js-cookie';

const LanguageChange = () => {
    const router = useRouter();

    const toggleLang = () => {
        const newLocale = router.locale === 'mn' ? 'en' : 'mn';
        jsCookie.set('NEXT_LOCALE', newLocale);
        router.push(router.asPath, undefined, {
            locale: newLocale,
        });
    };

    return (
        <div className="lang-change">
            <Button
                className={router.locale === 'en' ? 'mn' : 'en'}
                onClick={toggleLang}
            >
                {router.locale === 'en' ? 'mn' : 'en'}
            </Button>
        </div>
    );
};

export default LanguageChange;
