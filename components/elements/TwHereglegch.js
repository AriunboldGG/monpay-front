import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н TwHereglegch element-г харуулж буй хэсэг
const TwHereglegch = (props) => {
    const $atts = props.atts;
    const $content = props.content;
    const $contentType = typeof $content;

    return (
        <RenderElementWrapper atts={$atts}>
            {$contentType === 'object' &&
                $content.map((conItem, i) => (
                    <Row key={i}>
                        <Col md={6}>
                            <div className="hereglegch-img">
                                {(conItem.atts.main_title
                                    ? conItem.atts.main_title
                                    : []) && (
                                    <div className="aa">
                                        <img src={conItem.atts.image} />
                                        {/* <h4>{conItem.atts.main_title}</h4> */}
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div>
                                {conItem.atts.main_title && conItem.content && (
                                    <div className="content">
                                        <span>{conItem.atts.main_title}</span>
                                        <span>{conItem.content}</span>
                                        {conItem.atts.markers.map(
                                            (marker, i) => (
                                                <div key={i}>
                                                    <span className="cats">
                                                        {marker.page_title}
                                                    </span>
                                                    <span className="cats">
                                                        {marker.link}
                                                    </span>
                                                    <img src={marker.icon} />
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                ))}
        </RenderElementWrapper>
    );
};

export default TwHereglegch;
