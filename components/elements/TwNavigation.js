import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н TwNavigation element-г харуулж буй хэсэг
const TwNavigation = (props) => {
    const $atts = props.atts;
    const $content = props.content;
    const $contentType = typeof $content;

    return (
        <RenderElementWrapper atts={$atts}>
            {$contentType === 'object' &&
                $content.map((contItem, i) => (
                    <div
                        className={'button-icon order-' + (i % 2 ? '2' : '1')}
                        key={i}
                    >
                        <div className="titles">
                            <span className="main-title">
                                {contItem.atts.main_title}
                            </span>
                            <span className="top-title">
                                {contItem.atts.top_title}
                            </span>
                        </div>
                        <a href={contItem.atts.link} className="button-link">
                            <div className="button-image">
                                <img src={contItem.atts.image} />
                            </div>
                        </a>
                    </div>
                ))}
        </RenderElementWrapper>
    );
};

export default TwNavigation;
