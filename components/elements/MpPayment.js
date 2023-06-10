import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н MpPaymentItem element-г харуулж буй хэсэг
const MpPaymentItem = (props) => {
    const $atts = props.atts;
    const $content = props.content;
    const $contentType = typeof $content;

    return (
        <RenderElementWrapper atts={$atts}>
            {$contentType === 'object' &&
                $content.map((contItem, i) => (
                    <Row
                        className={
                            'mp-feature order-row-' + (i % 2 ? '2' : '1')
                        }
                        key={i}
                    >
                        <Col
                            className="p-0 mp-payment-empty-col"
                            md={2}
                            sm={2}
                        ></Col>
                        <Col
                            className={
                                'mp-feature-big-img   order-' +
                                (i % 2 ? '2' : '1')
                            }
                            md={6}
                            lg={6}
                            sm={6}
                            xl={6}
                        >
                            {(contItem ? contItem.atts.image : '') && (
                                <img src={contItem.atts.image} />
                            )}
                        </Col>
                        <Col
                            className={
                                'mp-feature-right-side  order-' +
                                (i % 2 ? '1' : '2')
                            }
                            style={{ marginTop: '135px' }}
                            md={4}
                            sm={4}
                            lg={4}
                            xl={4}
                        >
                            <div>
                                {contItem && contItem.atts.main_title && (
                                    <div className="mp-feature-inner">
                                        <h3 className="tw-simple-main-title">
                                            {' '}
                                            {contItem.atts.main_title}
                                        </h3>
                                    </div>
                                )}
                                {contItem.content && (
                                    <div
                                        className="content"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                '<p>' +
                                                contItem.content +
                                                '</p>',
                                        }}
                                    ></div>
                                )}
                            </div>
                            <div className="mp-feature-link">
                                <a href={contItem.atts.button_url}>
                                    {contItem && contItem.atts.icon_image && (
                                        <div className="image-stack">
                                            <img
                                                className="image1"
                                                src={contItem.atts.icon_image}
                                            />
                                            <img
                                                className="image2"
                                                src={contItem.atts.icon_image}
                                            />
                                        </div>
                                    )}
                                    {contItem &&
                                        contItem.atts.button_title &&
                                        contItem.atts.button_url &&
                                        contItem.atts.desc && (
                                            <div className="mp-feature-link-inner">
                                                <span>
                                                    {contItem.atts.desc}
                                                </span>
                                                <span className="button-title">
                                                    {contItem.atts.button_title}
                                                </span>
                                            </div>
                                        )}
                                </a>
                            </div>
                        </Col>
                    </Row>
                ))}
        </RenderElementWrapper>
    );
};

export default MpPaymentItem;
