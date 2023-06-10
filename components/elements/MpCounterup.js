import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
import { Row, Col } from 'react-bootstrap';

//Wordpress-н counter element-г харуулж буй хэсэг
const MpCounterup = (props) => {
    const $atts = props.atts;

    return (
        <RenderElementWrapper atts={$atts}>
            <Row>
                <Col className="p-0 mp-counter">
                    {$atts.image &&
                        $atts.counter_number &&
                        $atts.counter_data_title &&
                        $atts.counter_title && (
                            <div className="stack">
                                <img className="image" src={$atts.image} />
                                <div className="inner-content">
                                    <span className="intro-number">
                                        {$atts.counter_number}
                                        {$atts.counter_data_title}
                                    </span>
                                    <h5 className="intro-title">
                                        {$atts.counter_title}
                                    </h5>
                                </div>
                            </div>
                        )}
                </Col>
            </Row>
        </RenderElementWrapper>
    );
};

export default MpCounterup;
