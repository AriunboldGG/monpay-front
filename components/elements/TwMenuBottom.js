import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
import Link from 'next/link';
//Wordpress-н TwMenuBottom element-г харуулж буй хэсэг
const TwMenuBottom = (props) => {
    const $atts = props.atts;

    return (
        <RenderElementWrapper atts={$atts}>
            <div className="tw-menu-bottom-content">
                {($atts.image && $atts.top_title
                    ? $atts.image && $atts.top_title
                    : '') && (
                    <div>
                        <div className="image">
                            <img src={$atts.image} />
                        </div>
                        <span className="description">{$atts.top_title}</span>
                        <div className="tw-menu-button">
                            <div className="tw-menu-button-inner">
                                {($atts.page_title
                                    ? $atts.page_title && $atts.link
                                    : '') && (
                                    <Link href={`mailto: ${$atts.link}`}>
                                        {$atts.page_title}
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="tw-menu-apps">
                            {($atts.markers ? $atts.markers : '').map(
                                (marker, i) => (
                                    <div className="tw-menu-item" key={i}>
                                        <a href={marker.link}>
                                            <img src={marker.image} />
                                        </a>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </RenderElementWrapper>
    );
};

export default TwMenuBottom;
