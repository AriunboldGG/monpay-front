import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н TwQr element-г харуулж буй хэсэг
const TwQr = (props) => {
    const $atts = props.atts;

    return (
        <RenderElementWrapper atts={$atts}>
            {($atts.title ? $atts.top_title : '') && (
                <div className="titles">
                    <span className="qr-main-title">{$atts.title}</span>
                    <span className="qr-top-title">{$atts.top_title}</span>
                </div>
            )}
            {($atts.image ? $atts.bottom_title && $atts.open_item : '') && (
                <div className="tw-qr-item">
                    <div className="tw-qr-content">
                        <img className="mp-qr-img" src={$atts.image} />
                        <span className="mp-qr-number">{$atts.open_item}</span>
                    </div>
                    <span className="mp-qr-title">{$atts.bottom_title}</span>
                </div>
            )}
        </RenderElementWrapper>
    );
};

export default TwQr;
