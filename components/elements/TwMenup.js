import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
import Link from 'next/link';
import IctLink from 'components/IctLink';

//Wordpress-н TwMenup element-г харуулж буй хэсэг
const TwMenup = (props) => {
    const $atts = props.atts;

    return (
        <RenderElementWrapper atts={$atts}>
            <div className="tw-menu-content">
                {($atts ? $atts.menu_title : '') && (
                    <span>{$atts.menu_title}</span>
                )}
                {($atts && $atts.markers).map((marker, i) => (
                    <div className="tw-menu-link" key={i}>
                        <Link aria-current="page" href={marker.link}>
                            {marker.page_title}
                        </Link>
                        {/* <IctLink
                            aria-current="page"
                            activeClassName="active"
                            href={marker.link}
                            // hrefCustom={menuItem.custom_active_link}
                        >
                            <a>{marker.page_title}</a>
                        </IctLink> */}
                    </div>
                ))}
            </div>
        </RenderElementWrapper>
    );
};

export default TwMenup;
