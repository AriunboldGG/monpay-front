import { useRouter } from 'next/router';
import { Breadcrumb } from 'react-bootstrap';
import { ictTrimSlashes, ictRmMultiSlashes } from 'lib/Functions';
import useTranslation from 'next-translate/useTranslation';

function IctBreadCrumb(props) {
    const { breadcrumbList } = props;
    const { asPath } = useRouter();
    const $asPath = ictTrimSlashes(ictRmMultiSlashes(asPath));
    const { t, lang } = useTranslation('home-breadcrumb');
    return (
        <Breadcrumb className="tw-breadcrumb">
            {breadcrumbList.map((breadcrumb, index) => {
                const url = breadcrumb.url
                    ? ictTrimSlashes(ictRmMultiSlashes(breadcrumb.url))
                    : '';
                return breadcrumb.position ? (
                    breadcrumb.name ? (
                        url || breadcrumb.position === 1 ? (
                            <Breadcrumb.Item
                                key={breadcrumb.position}
                                href={'/' + url}
                                // href={lang && lang === 'mn' ? '/' + url : '/en'}
                                active={$asPath === url}
                            >
                                {breadcrumb.name}
                            </Breadcrumb.Item>
                        ) : (
                            <ul key={index}>
                                {' '}
                                <li className="breadcrumb-item-title">
                                    {breadcrumb.name}
                                </li>
                            </ul>
                        )
                    ) : null
                ) : (
                    <Breadcrumb.Item
                        key={breadcrumb.position}
                        href={lang && lang === 'en' ? '/en' : '/'}
                        active={$asPath === '/'}
                    >
                        {lang && lang === 'en' ? 'Home' : 'Нүүр'}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
}
export default IctBreadCrumb;
