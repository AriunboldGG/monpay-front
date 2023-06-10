import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Content from 'components/Content';
import IctBreadCrumb from 'components/IctBreadCrumb';

const Partner = (props) => {
    const { page, themeOption, post_type, acf } = props;
    let sectionMain = [];
    if (page.content) {
        sectionMain.push(
            <Content
                key="post-content"
                id={page.id}
                themeOption={themeOption}
                content={page.content}
                acf={page.acf}
            />
        );
    }

    return (
        <>
            <Container>
                <Row>
                    <Col className="p-0">
                        <div className="tw-partner-single-content">
                            <IctBreadCrumb
                                breadcrumbList={page.breadcrumb_list}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row className="tw-partner-single">
                    <Col className="single-big-content" md={8}>
                        <Row>
                            <Col className="tw-partner-single-image p-0" md={2}>
                                {(page.featured_image
                                    ? page.featured_image
                                    : '') && <img src={page.featured_image} />}
                            </Col>
                            <Col className="tw-partner-single-content p-0">
                                {(page.acf.Content
                                    ? page.acf.Content &&
                                      page.acf.tovch_medeelel
                                    : '') && (
                                    <div>
                                        <span className="tw-partner-single-main-title">
                                            {page.acf.tovch_medeelel}
                                        </span>
                                        <div>
                                            <span className="tw-partner-single-desc">
                                                {page.acf.Content}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {(page.acf.web_link
                                    ? page.acf.web_link &&
                                      page.acf.phone &&
                                      page.acf.mail
                                    : '') && (
                                    <div className="tw-partner-information">
                                        <div className="single-web">
                                            <img src="/link1.svg" />
                                            <a href="#">
                                                <span>{page.acf.web_link}</span>
                                            </a>
                                        </div>
                                        <div className="single-phone">
                                            <img src="/icon-call.svg" />
                                            <span>{page.acf.phone}</span>
                                        </div>
                                        <div className="single-mail">
                                            <img src="/icon-send.svg" />
                                            <span>{page.acf.mail}</span>
                                        </div>
                                    </div>
                                )}
                            </Col>
                        </Row>
                        <Row className="tw-partner-single-content-2">
                            <Col className="p-0">
                                {(page.content ? page.content : '') && (
                                    <div>
                                        <div
                                            className="single-content"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    '<p>' +
                                                    page.content +
                                                    '</p>',
                                            }}
                                        ></div>
                                    </div>
                                )}
                                <div>
                                    <span className="single-related-title">
                                        Төстэй байгууллагууд
                                    </span>
                                </div>
                                <div className="single-related-posts">
                                    {page.latest_posts_partners &&
                                        page.latest_posts_partners.map(
                                            (item, i) => (
                                                <a
                                                    href={`/partner/${item.id}`}
                                                    key={i}
                                                >
                                                    <div className="post-content-partner p-0">
                                                        {(item.img
                                                            ? item.title &&
                                                              item.desc
                                                            : '') && (
                                                            <div className="post-content-partner-inner">
                                                                <img
                                                                    className="content-image"
                                                                    src={
                                                                        item.img
                                                                    }
                                                                />
                                                                <div className="post-title-partner">
                                                                    {item.title}
                                                                </div>
                                                                <div
                                                                    href="#"
                                                                    className="post-desc-partner"
                                                                >
                                                                    {item.desc}
                                                                    ...
                                                                </div>
                                                                <div className="post-link-partner">
                                                                    <img src="/icon-arrow-rightt.svg" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </a>
                                            )
                                        )}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="partner-border" md={1}></Col>
                    <Col md={3}>
                        <div className="widget-title">
                            <span className="title-partner">
                                Хамтрагч байгууллагууд
                            </span>
                        </div>
                        {page.partner_cats &&
                            Object.entries(page.partner_cats) &&
                            Object.entries(page.partner_cats).map(
                                ([id, cat], i) => (
                                    <div className="sub-menu" key={i}>
                                        <span className="widget-menu-item">
                                            {cat.name}
                                        </span>
                                        <span className="cat-count">
                                            {cat.count}
                                        </span>
                                    </div>
                                )
                            )}
                        <div className="partner-single-menu-bottom">
                            <div className="image">
                                <img src="/monpay-white-logo.svg" />
                            </div>
                            <span className="description">
                                Бидэнтэй хамтран ажиллах хүсэлтээ яг одоо
                                онлайнаар илгээнэ үү.
                            </span>
                            <div className="tw-menu-button">
                                <div className="tw-menu-button-inner">
                                    <a href="#">Хүсэлт илгээх</a>
                                </div>
                            </div>
                            <div className="tw-menu-apps">
                                <div className="tw-menu-item">
                                    <a href="">
                                        <img src="/icon-appstoree.svg" />
                                    </a>
                                    <a href="">
                                        <img src="/icon-appgalleryy.svg" />
                                    </a>
                                    <a href="">
                                        <img src="/icon-huaweii.svg" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Partner;
