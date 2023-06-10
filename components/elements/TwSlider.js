import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
import { Row, Col, Carousel } from 'react-bootstrap';
//Wordpress-н TwSlider element-г харуулж буй хэсэг
const TwSlider = (props) => {
    const $content = props.content;
    const $contentType = typeof $content;
    const $atts = props.atts;

    return (
        <RenderElementWrapper atts={$atts}>
            {$contentType === 'object' &&
                $content.map((contItem, i) => (
                    <Row className="mp-hero-slider" key={i}>
                        <Col className="left-side" md={5} lg={5} sm={12}>
                            <div className="mp-left-slider-content">
                                <div className="hero-slider-title">
                                    {contItem &&
                                        contItem.atts.top_title &&
                                        contItem.atts.description && (
                                            <>
                                                <h1 className="hero-slider-main-title">
                                                    <span>
                                                        {
                                                            contItem.atts
                                                                .top_title
                                                        }
                                                    </span>
                                                </h1>
                                                <p className="hero-slider-description">
                                                    {contItem.atts.description}
                                                </p>
                                            </>
                                        )}
                                </div>
                                {/* <div className="mp-hero-slider-left-link">
                                    <div className="mp-hero-slider-button">
                                        {contItem &&
                                            contItem.atts.button &&
                                            contItem.atts.button.url &&
                                            contItem.atts.button.title && (
                                                <>
                                                    <img src="/icon-mobile.svg" />
                                                    <a
                                                        href={
                                                            contItem.atts.button
                                                                .url
                                                        }
                                                    >
                                                        {
                                                            contItem.atts.button
                                                                .title
                                                        }
                                                    </a>
                                                </>
                                            )}
                                    </div>
                                    <div className="mp-hero-slider-rating">
                                        <div className="mp-hero-slider-img">
                                            <img src="/avatars.png" />
                                        </div>
                                        <div className="mp-hero-slider-unelgee">
                                            {contItem &&
                                                contItem.atts
                                                    .bottom_title_rate &&
                                                contItem.atts
                                                    .bottom_title_icon && (
                                                    <div>
                                                        <div className="rate">
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 16 16"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M10.2606 3.47325L11.2006 5.35325C11.3273 5.61325 11.6673 5.85992 11.954 5.91325L13.654 6.19325C14.7406 6.37325 14.994 7.15992 14.214 7.94659L12.8873 9.27325C12.6673 9.49325 12.5406 9.92659 12.614 10.2399L12.994 11.8799C13.294 13.1733 12.6006 13.6799 11.4606 12.9999L9.86729 12.0533C9.58062 11.8799 9.10062 11.8799 8.81395 12.0533L7.22062 12.9999C6.08063 13.6733 5.38731 13.1733 5.68731 11.8799L6.06731 10.2399C6.14064 9.93325 6.01397 9.49992 5.79397 9.27325L4.46731 7.94659C3.68731 7.16659 3.94065 6.37992 5.02731 6.19325L6.72729 5.91325C7.01395 5.86659 7.35395 5.61325 7.48062 5.35325L8.42062 3.47325C8.92062 2.45325 9.74729 2.45325 10.2606 3.47325Z"
                                                                    fill="#FFC700"
                                                                />
                                                                <path
                                                                    opacity="0.4"
                                                                    d="M5.33331 3.83325H1.33331C1.05998 3.83325 0.833313 3.60659 0.833313 3.33325C0.833313 3.05992 1.05998 2.83325 1.33331 2.83325H5.33331C5.60665 2.83325 5.83331 3.05992 5.83331 3.33325C5.83331 3.60659 5.60665 3.83325 5.33331 3.83325Z"
                                                                    fill="#FFC700"
                                                                />
                                                                <path
                                                                    opacity="0.4"
                                                                    d="M3.33331 13.1666H1.33331C1.05998 13.1666 0.833313 12.94 0.833313 12.6666C0.833313 12.3933 1.05998 12.1666 1.33331 12.1666H3.33331C3.60665 12.1666 3.83331 12.3933 3.83331 12.6666C3.83331 12.94 3.60665 13.1666 3.33331 13.1666Z"
                                                                    fill="#FFC700"
                                                                />
                                                                <path
                                                                    opacity="0.4"
                                                                    d="M1.99998 8.49994H1.33331C1.05998 8.49994 0.833313 8.27327 0.833313 7.99994C0.833313 7.72661 1.05998 7.49994 1.33331 7.49994H1.99998C2.27331 7.49994 2.49998 7.72661 2.49998 7.99994C2.49998 8.27327 2.27331 8.49994 1.99998 8.49994Z"
                                                                    fill="#FFC700"
                                                                />
                                                            </svg>
                                                            <span>
                                                                {
                                                                    contItem
                                                                        .atts
                                                                        .bottom_title_rate
                                                                }
                                                            </span>
                                                        </div>
                                                        <h6 className="unelgee-title">
                                                            {
                                                                contItem.atts
                                                                    .bottom_title_icon
                                                            }
                                                        </h6>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </Col>
                        <Col className="right-side" md={7} lg={7} sm={7}>
                            <div className="slider-images">
                                {(contItem.atts.markers
                                    ? contItem.atts.markers
                                    : []
                                ).map((marker, i) => (
                                    <img src={marker.image} key={i} />
                                ))}
                            </div>
                        </Col>
                    </Row>
                ))}
        </RenderElementWrapper>
    );
};

export default TwSlider;
