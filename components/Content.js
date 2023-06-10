import React, { Component } from 'react';
import RenderElements from 'components/elements/RenderElements';
import { useIct } from 'hooks/use-ict';
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
} from 'react-share';
import useTranslation from 'next-translate/useTranslation';

const Content = (props) => {
    // const { t, lang } = useTranslation('common')
    const { id, content, acf } = props;
    const { ictCtx, setIctCtx } = useIct();
    if (content || single) {
        if (typeof content === 'object' && content.length) {
            return <RenderElements elements={content} />;
        } else {
            return (
                <div className="entry-content">
                    {content && typeof content === 'string' && (
                        <div
                            className="entry-content-inner"
                            dangerouslySetInnerHTML={{
                                __html: '<p>' + content + '</p>',
                            }}
                        ></div>
                    )}
                    {acf && (acf.post_location || acf.post_phone) && (
                        <div className="entry-content-acf">
                            {acf.post_location && (
                                <p className="entry-content-acf-location">
                                    {acf.post_location}
                                </p>
                            )}
                            {acf.post_phone && (
                                <p className="entry-content-acf-phone">
                                    {acf.post_phone}
                                </p>
                            )}
                        </div>
                    )}
                    {ictCtx && ictCtx.path && (
                        <div className="entry-share">
                            <FacebookShareButton
                                url={
                                    process.env.NEXT_PUBLIC_SITE_URL +
                                    '/' +
                                    ictCtx.path
                                }
                                className="entry-share-item share-facebook"
                            >
                                {t('share')}
                            </FacebookShareButton>
                            <LinkedinShareButton
                                url={
                                    process.env.NEXT_PUBLIC_SITE_URL +
                                    '/' +
                                    ictCtx.path
                                }
                                className="entry-share-item share-linkedin"
                            >
                                {t('share')}
                            </LinkedinShareButton>
                            <TwitterShareButton
                                url={
                                    process.env.NEXT_PUBLIC_SITE_URL +
                                    '/' +
                                    ictCtx.path
                                }
                                className="entry-share-item share-twitter"
                            >
                                Мэдээг бусдадтай хуваалцах
                            </TwitterShareButton>
                        </div>
                    )}
                </div>
            );
        }
    }
    return null;
};
export default Content;
