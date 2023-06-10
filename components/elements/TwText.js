import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н TwText element-г харуулж буй хэсэг
const TwText = (props) => {
    const $atts = props.atts;
    const $content = props.content;

    return (
        <RenderElementWrapper atts={$atts}>
            {($content ? $content : '') && (
                <div
                    className="content"
                    dangerouslySetInnerHTML={{
                        __html: '<p>' + $content + '</p>',
                    }}
                ></div>
            )}
        </RenderElementWrapper>
    );
};

export default TwText;
