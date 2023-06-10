import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н MpIntroduction element-г харуулж буй хэсэг
const MpIntroduction = (props) => {
    const $atts = props.atts;
    const $content = props.content;

    return (
        <RenderElementWrapper atts={$atts}>
            <Row>
                <Col md={2}>
                    {$atts.image && (
                        <div className="intro-img">
                            <img src={$atts.image} />
                        </div>
                    )}
                </Col>
                <Col>
                    {$atts.main_title && $content && (
                        <div className="content">
                            <h2 className="title">{$atts.main_title}</h2>
                            <p className="desc">{$content}</p>
                        </div>
                    )}
                </Col>
            </Row>
        </RenderElementWrapper>
    );
};

export default MpIntroduction;
