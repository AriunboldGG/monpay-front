import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { RenderElementWrapper } from 'components/elements/RenderElements';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
/*Мэдээ хуудасны онцлох мэдээ дуудаж буй хэсэг*/
const MpOntsloh = (props) => {
    const $atts = props.atts;
    const $content = props.content;
    const [newsHighlithed, setHighlited] = useState([]);
    const [newsCategory, setNewsCategory] = useState([]);
    const { t, lang } = useTranslation('common');
    useEffect(() => {
        /*News */
        async function fetchData() {
            const respNews = await axios('/api/post/get-news').then(
                async (resp) => {
                    //Api-s highlithed news дуудах мөр код
                    if (resp?.data?.result) {
                        setHighlited(resp.data.result);
                    }
                    //Api-s category дуудах мөр код
                    const respCats = await axios('/api/post/get-category');
                    if (respCats?.data?.length) {
                        setNewsCategory(respCats.data);
                    }
                },
                (error) => {}
            );
        }
        fetchData();
    }, []);
    return (
        <RenderElementWrapper atts={$atts}>
            {newsHighlithed.map((item, i) => {
                if (item.highlighted === true) {
                    return (
                        <Row key={i}>
                            <Col md={5} className="mp-ontsloh-top">
                                <div className="ontsloh-img">
                                    <div className="aa">
                                        <img src={item.backgroundImg} />
                                        <span>{t('featuredNews')}</span>
                                    </div>
                                </div>
                            </Col>
                            <Col
                                className="ontsloh-background"
                                md={7}
                                lg={7}
                                sm={7}
                            >
                                <div>
                                    {
                                        <div className="content">
                                            <span>{item.createDateUI}</span>
                                            <span className="cats">
                                                {newsCategory &&
                                                    newsCategory.map(
                                                        (itemCatNews, i) => {
                                                            if (
                                                                item.newsCatId ===
                                                                itemCatNews.id
                                                            ) {
                                                                return (
                                                                    <span
                                                                        className="cats"
                                                                        key={i}
                                                                    >
                                                                        {
                                                                            itemCatNews.nameMn
                                                                        }
                                                                    </span>
                                                                );
                                                            }
                                                        }
                                                    )}
                                            </span>
                                            <h4>{item.headline}</h4>
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: item.subject,
                                                }}
                                            ></p>
                                            <div className="link">
                                                <Link
                                                    href={`/post/${item.newsId}`}
                                                >
                                                    <a
                                                        // href={`/post/${item.newsId}`}
                                                        target="_blank"
                                                    >
                                                        {t('readMore')}
                                                    </a>
                                                </Link>
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699"
                                                        stroke="#161E34"
                                                        strokeWidth="1.5"
                                                        strokeMiterlimit="10"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M3.5 12H20.33"
                                                        stroke="#161E34"
                                                        strokeWidth="1.5"
                                                        strokeMiterlimit="10"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </Col>
                        </Row>
                    );
                }
            })}
        </RenderElementWrapper>
    );
};

export default MpOntsloh;
