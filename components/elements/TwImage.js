import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
import Link from 'next/link';
//Wordpress-н TwImage element-г харуулж буй хэсэг
const TwImage = (props) => {
    let $atts = props.atts;
    return (
        <RenderElementWrapper atts={$atts}>
            {$atts.image && $atts.link ? (
                <Link href={$atts.link}>
                    <img src={$atts.image} className="tw-image" />
                </Link>
            ) : (
                <img src={$atts.image} className="tw-image" />
            )}
        </RenderElementWrapper>
    );
};

export default TwImage;
