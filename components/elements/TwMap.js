import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н TwMap element-г харуулж буй хэсэг
const TwMap = (props) => {
    const $atts = props.atts;

    return (
        <RenderElementWrapper atts={$atts}>
            {$atts &&
                $atts.markers.map((marker, i) => (
                    <div className="tw-map-img" key={i}>
                        <img src={marker.icon} />
                    </div>
                ))}
        </RenderElementWrapper>
    );
};

export default TwMap;
