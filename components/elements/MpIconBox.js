import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н MpIconBox element-г харуулж буй хэсэг
const MpIconBox = (props) => {
    //props-р дамжуулан wordpress-s утгаа авна
    const $atts = props.atts;

    return (
        <RenderElementWrapper atts={$atts}>
            {($atts.image && $atts.iconbox_title
                ? $atts.image && $atts.iconbox_title
                : '') && (
                <div className="mp-iconbox-content">
                    <div className="mp-image">
                        {' '}
                        <img src={$atts.image} />
                    </div>
                    <div className="mp-desc">
                        <p>{$atts.iconbox_title}</p>
                    </div>
                </div>
            )}
        </RenderElementWrapper>
    );
};

export default MpIconBox;
