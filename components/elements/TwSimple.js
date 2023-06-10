import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н TwSimple element-г харуулж буй хэсэг
const TwSimple = (props) => {
    const $atts = props.atts;
    const $content = props.content;
    const $contentType = typeof $content;

    return (
        <RenderElementWrapper atts={$atts}>
            {$contentType === 'object' && (
                <Row>
                    {$contentType === 'object' &&
                        $content.map((contItem, i) => {
                            let contItemGrid = '6';
                            let bgimage = '';
                            switch (i) {
                                case 0:
                                    contItemGrid = '6';
                                    break;
                                case 1:
                                    contItemGrid = '3';
                                    break;
                                case 2:
                                    contItemGrid = '3';
                                    break;
                                case 3:
                                    contItemGrid = '3';
                                    break;
                                case 4:
                                    contItemGrid = '3';
                                    break;
                                case 5:
                                    contItemGrid = '6';
                                    bgimage = 'image-2';
                                    break;
                                default:
                                    contItemGrid = '6';
                            }
                            if (contItem.atts.image) {
                                return (
                                    <Col
                                        className="mp-simple-item"
                                        md={contItemGrid}
                                        key={i}
                                    >
                                        <div
                                            className="mp-simple-item-inner"
                                            style={{
                                                backgroundColor:
                                                    contItem.atts.bg_color,
                                                borderRadius: '8px',
                                            }}
                                        >
                                            <Row>
                                                <Col>
                                                    <div className="mp-simple-content">
                                                        {((contItem.atts
                                                            .main_title &&
                                                            contItem.atts
                                                                .button_url &&
                                                            contItem.atts
                                                                .button_title &&
                                                            contItem.content &&
                                                            contItem.atts
                                                                .bg_color &&
                                                            contItem.atts
                                                                .icon &&
                                                            contItem.atts
                                                                .button_color &&
                                                            contItem.atts
                                                                .fi_bgcolor) ||
                                                            []) && (
                                                            <div className="mp-simple-content-inner">
                                                                <div className="mp-simple-non-hide">
                                                                    <img
                                                                        src={
                                                                            contItem
                                                                                .atts
                                                                                .icon
                                                                        }
                                                                        style={{
                                                                            boxShadow:
                                                                                contItem
                                                                                    .atts
                                                                                    .fi_bgcolor,
                                                                        }}
                                                                    />
                                                                    <h4>
                                                                        {
                                                                            contItem
                                                                                .atts
                                                                                .main_title
                                                                        }
                                                                    </h4>
                                                                </div>
                                                                <div className="mp-simple-hide">
                                                                    <p>
                                                                        {
                                                                            contItem.content
                                                                        }
                                                                    </p>
                                                                    <a
                                                                        style={{
                                                                            color: contItem
                                                                                .atts
                                                                                .button_color,
                                                                        }}
                                                                        href={
                                                                            contItem
                                                                                .atts
                                                                                .button_url
                                                                        }
                                                                    >
                                                                        {
                                                                            contItem
                                                                                .atts
                                                                                .button_title
                                                                        }
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                                <Col className="p-0 mp-simle-empty">
                                                    {contItem.atts.image && (
                                                        <div
                                                            className={`big-image ${bgimage}`}
                                                        >
                                                            <img
                                                                src={
                                                                    contItem
                                                                        .atts
                                                                        .image
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                );
                            } else if (contItem.atts.icon) {
                                return (
                                    <Col
                                        className="mp-simple-item"
                                        md={contItemGrid}
                                        key={i}
                                    >
                                        <div
                                            className="mp-simple-item-inner"
                                            style={{
                                                backgroundColor:
                                                    contItem.atts.bg_color,
                                                borderRadius: '8px',
                                            }}
                                        >
                                            <div className="mp-simple-content">
                                                {((contItem.atts.main_title &&
                                                    contItem.atts.button_url &&
                                                    contItem.atts
                                                        .button_title &&
                                                    contItem.content &&
                                                    contItem.atts.bg_color &&
                                                    contItem.atts.icon &&
                                                    contItem.atts
                                                        .button_color &&
                                                    contItem.atts.fi_bgcolor) ||
                                                    []) && (
                                                    <div className="mp-simple-content-inner">
                                                        <img
                                                            src={
                                                                contItem.atts
                                                                    .icon
                                                            }
                                                            style={{
                                                                boxShadow:
                                                                    contItem
                                                                        .atts
                                                                        .fi_bgcolor,
                                                            }}
                                                        />
                                                        <h4>
                                                            {
                                                                contItem.atts
                                                                    .main_title
                                                            }
                                                        </h4>
                                                        <div className="mp-simple-hide">
                                                            <p>
                                                                {
                                                                    contItem.content
                                                                }
                                                            </p>
                                                            <a
                                                                style={{
                                                                    color: contItem
                                                                        .atts
                                                                        .button_color,
                                                                }}
                                                                href={
                                                                    contItem
                                                                        .atts
                                                                        .button_url
                                                                }
                                                            >
                                                                {
                                                                    contItem
                                                                        .atts
                                                                        .button_title
                                                                }
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                );
                            }
                            return null;
                        })}
                </Row>
            )}
        </RenderElementWrapper>
    );
};

export default TwSimple;
