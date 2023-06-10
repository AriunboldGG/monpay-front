import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
import { Row, Col } from 'react-bootstrap';
//Wordpress-н MpIconBoxItem element-г харуулж буй хэсэг
const MpIconBoxItem = (props) => {
    const $atts = props.atts;
    const $content = props.content;
    const $contentType = typeof $content;

    return (
        <RenderElementWrapper atts={$atts}>
            <div className={$atts.hover}>
                {($atts.main_title ? $atts.main_title : '') && (
                    <div className="mp-iconbox-main-title">
                        <h4>{$atts.main_title}</h4>
                    </div>
                )}
                <Row className="no-gutters">
                    {$contentType === 'object' &&
                        $content.map((contItem, i) => (
                            <Col md={6} sm={6} xs={12} key={i}>
                                <div className="mp-iconbox-content-out">
                                    <div className="mp-iconbox-content">
                                        <div className="mp-inner-content">
                                            <div
                                                className="iconbox-image"
                                                style={{
                                                    backgroundColor:
                                                        contItem.atts.bg_color,
                                                }}
                                            >
                                                <img
                                                    src={contItem.atts.image}
                                                />
                                            </div>
                                            <div className="iconbox-desc">
                                                <p>{contItem.atts.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                </Row>
            </div>
        </RenderElementWrapper>
    );
};

export default MpIconBoxItem;
