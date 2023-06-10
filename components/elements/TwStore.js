import React from 'react';
import { Col } from 'react-bootstrap';
import { RenderElementWrapper } from 'components/elements/RenderElements';
import Link from 'next/link';
//Wordpress-н TwStore element-г харуулж буй хэсэг
const TwStore = (props) => {
    const $atts = props.atts;

    return (
        <RenderElementWrapper atts={$atts}>
            <Col className="tw-store">
                {$atts &&
                    $atts.markers.map((marker, i) => (
                        <Link href={marker.link} key={i}>
                            <a
                                className="tw-store-inner"
                                // key={i}
                                // href={marker.link}
                                target="_blank"
                            >
                                <img src={marker.image} />
                                <span className="tw-store-link">
                                    {marker.title}
                                </span>
                            </a>
                        </Link>
                    ))}
            </Col>
        </RenderElementWrapper>
    );
};

export default TwStore;
