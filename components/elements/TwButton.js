import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н TwButton element-г харуулж буй хэсэг
const TwButton = (props) => {
    //props-r wordpressin back-s damjuulj bui utga orj irne
    const $atts = props.atts;

    return (
        <RenderElementWrapper atts={$atts}>
            {$atts.button_url && $atts.image && $atts.button_title && (
                <div className="heading-link">
                    <a href={$atts.button_url} className="mp-clints">
                        <div className="heading-icon">
                            <img src={$atts.image} />
                        </div>
                        <span>{$atts.button_title}</span>
                    </a>
                </div>
            )}
        </RenderElementWrapper>
    );
};

export default TwButton;
