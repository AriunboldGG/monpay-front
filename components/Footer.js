import React from 'react';
import RenderElements from 'components/elements/RenderElements';
import { Col, Row, Container } from 'react-bootstrap';
import uniqid from 'uniqid';
import IctLink from 'components/IctLink';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Footer = (props) => {
    const router = useRouter();

    const { themeOption } = props;
    const $atts = props.atts;
    const $content = props.content;
    return (
        <>
            {router && router.locale === 'mn' ? (
                <footer>
                    <div>
                        {themeOption.footer_content_2 &&
                            themeOption.footer_content_2.content_block && (
                                <RenderElements
                                    elements={
                                        themeOption.footer_content_2
                                            .content_block
                                    }
                                />
                            )}
                        {themeOption.footer_content_2 &&
                            themeOption.footer_content_2.custom_style && (
                                <style
                                    key="page-modal-style"
                                    dangerouslySetInnerHTML={{
                                        __html: themeOption.footer_content_2
                                            .custom_style,
                                    }}
                                ></style>
                            )}
                    </div>
                    <div className="main">
                        <Container>
                            <Row className="first-row">
                                <Col
                                    md={12}
                                    sm={12}
                                    lg={4}
                                    className="mp-footer-first-row"
                                >
                                    {themeOption &&
                                        themeOption.footer_logo &&
                                        themeOption.footer_logo.url && (
                                            <a href="#">
                                                <img
                                                    className="mp-footer-logo"
                                                    src={
                                                        themeOption.footer_logo
                                                            .url
                                                    }
                                                />
                                            </a>
                                        )}
                                    {themeOption.footer_text && (
                                        <p className="mp-footer-left-text">
                                            {themeOption.footer_text}
                                        </p>
                                    )}
                                </Col>

                                <Col
                                    md={12}
                                    sm={12}
                                    lg={2}
                                    className="footer-uilchilgee"
                                >
                                    {themeOption &&
                                        themeOption.footer_menu_1_title && (
                                            <div className="mp-footer-menu-title">
                                                {
                                                    themeOption.footer_menu_1_title
                                                }
                                            </div>
                                        )}
                                    {
                                        <ul className="mp-footer-menu">
                                            {themeOption &&
                                                themeOption.footer_menu_1 &&
                                                themeOption.footer_menu_1
                                                    .menu &&
                                                themeOption.footer_menu_1.menu.map(
                                                    (firstMenuItem) => (
                                                        <li
                                                            className="mp-footer-menu-item"
                                                            key={uniqid()}
                                                        >
                                                            <IctLink
                                                                activeClassName="active"
                                                                href={
                                                                    firstMenuItem.link
                                                                }
                                                            >
                                                                <a>
                                                                    {
                                                                        firstMenuItem.text
                                                                    }
                                                                </a>
                                                            </IctLink>
                                                        </li>
                                                    )
                                                )}
                                            <li className="mp-footer-openapi">
                                                <Link href="https://developers.monpay.mn/">
                                                    Open API
                                                </Link>
                                            </li>
                                            <li className="mp-footer-openapi">
                                                <Link href="https://merchant.monpay.mn/">
                                                    Merchant web
                                                </Link>
                                            </li>
                                        </ul>
                                    }
                                </Col>
                                <Col
                                    md={12}
                                    sm={12}
                                    lg={2}
                                    className="footer-uilchilgee"
                                >
                                    {themeOption &&
                                        themeOption.footer_menu_2_title && (
                                            <div className="mp-footer-menu-title">
                                                {
                                                    themeOption.footer_menu_2_title
                                                }
                                            </div>
                                        )}
                                    {
                                        <ul className="mp-footer-menu">
                                            {themeOption &&
                                                themeOption.footer_menu_2 &&
                                                themeOption.footer_menu_2
                                                    .menu &&
                                                themeOption.footer_menu_2.menu.map(
                                                    (secondMenuItem) => (
                                                        <li
                                                            className="mp-footer-menu-item"
                                                            key={uniqid()}
                                                        >
                                                            <IctLink
                                                                activeClassName="active"
                                                                href={
                                                                    secondMenuItem.link
                                                                }
                                                            >
                                                                <a>
                                                                    {
                                                                        secondMenuItem.text
                                                                    }
                                                                </a>
                                                            </IctLink>
                                                        </li>
                                                    )
                                                )}
                                        </ul>
                                    }
                                </Col>
                                <Col lg={1} md={0} sm={0}></Col>
                                <Col
                                    md={12}
                                    sm={12}
                                    lg={3}
                                    className="mp-footer-last"
                                >
                                    {themeOption.footer_content &&
                                        themeOption.footer_content
                                            .content_block && (
                                            <RenderElements
                                                elements={
                                                    themeOption.footer_content
                                                        .content_block
                                                }
                                            />
                                        )}

                                    {themeOption.footer_content &&
                                        themeOption.footer_content
                                            .custom_style && (
                                            <div
                                                key="page-modal-style"
                                                dangerouslySetInnerHTML={{
                                                    __html: themeOption
                                                        .footer_content
                                                        .custom_style,
                                                }}
                                            ></div>
                                        )}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mp-footer-copyright">
                                    {themeOption.footer_copyright_text && (
                                        <div
                                            className="mp-footer-copyright-text"
                                            dangerouslySetInnerHTML={{
                                                __html: themeOption.footer_copyright_text,
                                            }}
                                        ></div>
                                    )}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </footer>
            ) : (
                <footer>
                    <div>
                        {themeOption.footer_content_2_en &&
                            themeOption.footer_content_2_en.content_block && (
                                <RenderElements
                                    elements={
                                        themeOption.footer_content_2_en
                                            .content_block
                                    }
                                />
                            )}
                        {themeOption.footer_content_2_en &&
                            themeOption.footer_content_2_en.custom_style && (
                                <style
                                    key="page-modal-style"
                                    dangerouslySetInnerHTML={{
                                        __html: themeOption.footer_content_2_en
                                            .custom_style,
                                    }}
                                ></style>
                            )}
                    </div>
                    <div className="main">
                        <Container>
                            <Row className="first-row">
                                <Col
                                    md={12}
                                    sm={12}
                                    lg={4}
                                    className="mp-footer-first-row"
                                >
                                    {themeOption &&
                                        themeOption.footer_logo &&
                                        themeOption.footer_logo.url && (
                                            <a href="#">
                                                <img
                                                    className="mp-footer-logo"
                                                    src={
                                                        themeOption.footer_logo
                                                            .url
                                                    }
                                                />
                                            </a>
                                        )}
                                    {themeOption.footer_text_en && (
                                        <p className="mp-footer-left-text">
                                            {themeOption.footer_text_en}
                                        </p>
                                    )}
                                </Col>

                                <Col
                                    md={12}
                                    sm={12}
                                    lg={2}
                                    className="footer-uilchilgee"
                                >
                                    {themeOption &&
                                        themeOption.footer_menu_1_title_en && (
                                            <div className="mp-footer-menu-title">
                                                {
                                                    themeOption.footer_menu_1_title_en
                                                }
                                            </div>
                                        )}
                                    {
                                        <ul className="mp-footer-menu">
                                            {themeOption &&
                                                themeOption.footer_menu_1_en &&
                                                themeOption.footer_menu_1_en
                                                    .menu &&
                                                themeOption.footer_menu_1_en.menu.map(
                                                    (firstMenuItem) => (
                                                        <li
                                                            className="mp-footer-menu-item"
                                                            key={uniqid()}
                                                        >
                                                            <IctLink
                                                                activeClassName="active"
                                                                href={
                                                                    firstMenuItem.link
                                                                }
                                                            >
                                                                <a>
                                                                    {
                                                                        firstMenuItem.text
                                                                    }
                                                                </a>
                                                            </IctLink>
                                                        </li>
                                                    )
                                                )}
                                            <li className="mp-footer-openapi">
                                                <Link href="https://developers.monpay.mn/">
                                                    Open API
                                                </Link>
                                            </li>
                                            <li className="mp-footer-openapi">
                                                <Link href="https://merchant.monpay.mn/">
                                                    Merchant web
                                                </Link>
                                            </li>
                                        </ul>
                                    }
                                </Col>
                                <Col
                                    md={12}
                                    sm={12}
                                    lg={2}
                                    className="footer-uilchilgee"
                                >
                                    {themeOption &&
                                        themeOption.footer_menu_2_title_en && (
                                            <div className="mp-footer-menu-title">
                                                {
                                                    themeOption.footer_menu_2_title_en
                                                }
                                            </div>
                                        )}
                                    {
                                        <ul className="mp-footer-menu">
                                            {themeOption &&
                                                themeOption.footer_menu_2_en &&
                                                themeOption.footer_menu_2_en
                                                    .menu &&
                                                themeOption.footer_menu_2_en.menu.map(
                                                    (secondMenuItem) => (
                                                        <li
                                                            className="mp-footer-menu-item"
                                                            key={uniqid()}
                                                        >
                                                            <IctLink
                                                                activeClassName="active"
                                                                href={
                                                                    secondMenuItem.link
                                                                }
                                                            >
                                                                <a>
                                                                    {
                                                                        secondMenuItem.text
                                                                    }
                                                                </a>
                                                            </IctLink>
                                                        </li>
                                                    )
                                                )}
                                        </ul>
                                    }
                                </Col>
                                <Col lg={1} md={0} sm={0}></Col>
                                <Col
                                    md={12}
                                    sm={12}
                                    lg={3}
                                    className="mp-footer-last"
                                >
                                    {themeOption.footer_content_en &&
                                        themeOption.footer_content_en
                                            .content_block && (
                                            <RenderElements
                                                elements={
                                                    themeOption
                                                        .footer_content_en
                                                        .content_block
                                                }
                                            />
                                        )}

                                    {themeOption.footer_content_en &&
                                        themeOption.footer_content_en
                                            .custom_style && (
                                            <div
                                                key="page-modal-style"
                                                dangerouslySetInnerHTML={{
                                                    __html: themeOption
                                                        .footer_content_en
                                                        .custom_style,
                                                }}
                                            ></div>
                                        )}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mp-footer-copyright">
                                    {themeOption.footer_copyright_text_en && (
                                        <div
                                            className="mp-footer-copyright-text"
                                            dangerouslySetInnerHTML={{
                                                __html: themeOption.footer_copyright_text_en,
                                            }}
                                        ></div>
                                    )}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </footer>
            )}
        </>
    );
};

export default Footer;
